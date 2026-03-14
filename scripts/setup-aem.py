#!/usr/bin/env python3
"""
AEM Content Fragment Setup Script for UE Starter Framework
Creates sample content fragments for the Homepage and About pages.

Usage:
    python3 scripts/setup-aem.py
"""

import json
import urllib.request
import urllib.parse
import ssl
import sys

# ─── Configuration ──────────────────────────────────────────────
AEM_HOST = "https://author-p181502-e1907767.adobeaemcloud.com"
CLIENT_ID = "5c4950726df74f4fb71f1295b3718081"
CLIENT_SECRET = "p8e-mitRipQ0Dw2Uctd7c9If08MxXd4u_NZs"
SCOPES = "openid,AdobeID,aem.fragments.management,aem.folders"
DAM_PATH = "/content/dam/vyingdigitalpartnersandboxprogram"
CONF_PATH = "/conf/vyingdigitalpartnersandboxprogram"

# SSL context (some environments need this)
ctx = ssl.create_default_context()

# ─── Get Access Token ───────────────────────────────────────────
def get_token():
    print("🔐 Getting access token...")
    data = urllib.parse.urlencode({
        "grant_type": "client_credentials",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "scope": SCOPES
    }).encode()
    
    req = urllib.request.Request(
        "https://ims-na1.adobelogin.com/ims/token/v3",
        data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    
    with urllib.request.urlopen(req, context=ctx) as resp:
        result = json.loads(resp.read())
        print("✅ Token obtained")
        return result["access_token"]

# ─── API helpers ────────────────────────────────────────────────
def api_get(token, path):
    req = urllib.request.Request(
        f"{AEM_HOST}{path}",
        headers={
            "Authorization": f"Bearer {token}",
            "X-Adobe-Accept-Experimental": "1"
        }
    )
    with urllib.request.urlopen(req, context=ctx, timeout=60) as resp:
        return json.loads(resp.read())

def api_post(token, path, body):
    data = json.dumps(body).encode()
    req = urllib.request.Request(
        f"{AEM_HOST}{path}",
        data=data,
        method="POST",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "X-Adobe-Accept-Experimental": "1"
        }
    )
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=120) as resp:
            return resp.status, json.loads(resp.read())
    except urllib.error.HTTPError as e:
        return e.code, {"error": e.read().decode()[:300]}

# ─── Main ───────────────────────────────────────────────────────
def main():
    token = get_token()
    
    # 1. List existing models
    print("\n📋 Looking up CF models...")
    models_data = api_get(token, "/adobe/sites/cf/models")
    models = {}
    for m in models_data.get("items", []):
        path = m.get("path", "")
        if "vyingdigital" in path:
            name = m["name"]
            mid = m["id"]
            models[name.lower()] = mid
            print(f"  ★ {name} => {mid[:40]}...")
    
    if not models:
        print("  ❌ No models found under vyingdigitalpartnersandboxprogram")
        print("  Please create Hero, Title, Container models in AEM first")
        sys.exit(1)
    
    # 2. Create sample Hero fragment
    hero_id = models.get("hero")
    if hero_id:
        print("\n🖼️  Creating Hero fragment...")
        status, resp = api_post(token, "/adobe/sites/cf/fragments", {
            "title": "Starter-Welcome-Hero",
            "modelId": hero_id,
            "parentPath": DAM_PATH,
            "fields": [
                {"name": "title", "type": "text", "value": "Welcome to Starter Studio"}
            ]
        })
        print(f"  {'✅' if status < 300 else '❌'} HTTP {status}")
        if status < 300:
            frag_id = resp.get("id", "")
            print(f"  Fragment ID: {frag_id[:40]}...")
    
    # 3. Create sample Title fragment
    title_id = models.get("title")
    if title_id:
        print("\n📝 Creating Title fragment...")
        status, resp = api_post(token, "/adobe/sites/cf/fragments", {
            "title": "Starter-Services-Title",
            "modelId": title_id,
            "parentPath": DAM_PATH,
            "fields": [
                {"name": "title", "type": "text", "value": "Our Creative Services"}
            ]
        })
        print(f"  {'✅' if status < 300 else '❌'} HTTP {status}")
    
    # 4. Create Homepage container
    container_id = models.get("container")
    if container_id:
        print("\n📦 Creating Homepage container fragment...")
        status, resp = api_post(token, "/adobe/sites/cf/fragments", {
            "title": "Starter-Homepage",
            "modelId": container_id,
            "parentPath": DAM_PATH,
            "fields": [
                {"name": "title", "type": "text", "value": "Starter Studio Homepage"}
            ]
        })
        print(f"  {'✅' if status < 300 else '❌'} HTTP {status}")
        if status < 300:
            homepage_id = resp.get("id", "")
            print(f"  Homepage fragment ID: {homepage_id[:40]}...")
    
    # 5. Create About page container
    if container_id:
        print("\n📦 Creating About page container fragment...")
        status, resp = api_post(token, "/adobe/sites/cf/fragments", {
            "title": "Starter-About",
            "modelId": container_id,
            "parentPath": DAM_PATH,
            "fields": [
                {"name": "title", "type": "text", "value": "About Starter Studio"}
            ]
        })
        print(f"  {'✅' if status < 300 else '❌'} HTTP {status}")
    
    # 6. Create a second Title for About page
    if title_id:
        print("\n📝 Creating About Title fragment...")
        status, resp = api_post(token, "/adobe/sites/cf/fragments", {
            "title": "Starter-About-Title",
            "modelId": title_id,
            "parentPath": DAM_PATH,
            "fields": [
                {"name": "title", "type": "text", "value": "About Our Studio"}
            ]
        })
        print(f"  {'✅' if status < 300 else '❌'} HTTP {status}")
    
    print("\n" + "=" * 50)
    print("✅ Setup complete!")
    print("=" * 50)
    print(f"""
Next steps:
  1. Go to AEM Author → Assets → {DAM_PATH}
  2. Open 'Starter-Homepage' container and add references:
     - Add 'Starter-Welcome-Hero' to references
     - Add 'Starter-Services-Title' to references
  3. Open 'Starter-About' container and add references:
     - Add 'Starter-About-Title' to references
  4. Create persisted GraphQL queries:
     - Name: vyingdigitalpartnersandboxprogram/homepage
     - Name: vyingdigitalpartnersandboxprogram/aboutpage
  5. Start the app: cd ue-starter-framework && npm start
""")

if __name__ == "__main__":
    main()
