#!/usr/bin/env bash
# ================================================================
# AEM Content Fragment Setup Script for UE Starter Framework
# Creates sample content fragments for the Homepage and About pages
# ================================================================

set -e

# ─── Configuration ───────────────────────────────────────────────
AEM_HOST="https://author-p181502-e1907767.adobeaemcloud.com"
CLIENT_ID="5c4950726df74f4fb71f1295b3718081"
CLIENT_SECRET="p8e-mitRipQ0Dw2Uctd7c9If08MxXd4u_NZs"
SCOPES="openid,AdobeID,aem.fragments.management,aem.folders"
DAM_PATH="/content/dam/vyingdigitalpartnersandboxprogram"
CONF_PATH="/conf/vyingdigitalpartnersandboxprogram"

# ─── Get Access Token ────────────────────────────────────────────
echo "🔐 Getting access token..."
TOKEN=$(curl -s -X POST 'https://ims-na1.adobelogin.com/ims/token/v3' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d "grant_type=client_credentials" \
  -d "client_id=${CLIENT_ID}" \
  -d "client_secret=${CLIENT_SECRET}" \
  -d "scope=${SCOPES}" | python3 -c "import json,sys; print(json.load(sys.stdin)['access_token'])")

echo "✅ Token obtained"

# Helper function to create a content fragment
create_fragment() {
  local FOLDER_PATH="$1"
  local TITLE="$2"
  local MODEL_PATH="$3"
  local FIELDS="$4"
  
  echo "  📄 Creating fragment: ${TITLE}"
  
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${AEM_HOST}/adobe/sites/cf/fragments" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -H "X-Adobe-Accept-Experimental: 1" \
    -d "{
      \"title\": \"${TITLE}\",
      \"modelId\": \"${MODEL_PATH}\",
      \"parentPath\": \"${FOLDER_PATH}\",
      \"fields\": ${FIELDS}
    }")
  
  HTTP_CODE=$(echo "$RESPONSE" | tail -1)
  BODY=$(echo "$RESPONSE" | sed '$d')
  
  if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 300 ]; then
    echo "    ✅ Created (HTTP ${HTTP_CODE})"
    # Extract and return the fragment ID
    echo "$BODY" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('id',''))" 2>/dev/null || true
  else
    echo "    ❌ Failed (HTTP ${HTTP_CODE})"
    echo "    Response: $(echo "$BODY" | head -c 200)"
  fi
}

# Helper to create DAM folder
create_folder() {
  local FOLDER_PATH="$1"
  local TITLE="$2"
  
  echo "  📁 Creating folder: ${TITLE}"
  
  curl -s -w "\n%{http_code}" -X POST "${AEM_HOST}/adobe/folders" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -H "X-Adobe-Accept-Experimental: 1" \
    -d "{
      \"title\": \"${TITLE}\",
      \"parentPath\": \"${FOLDER_PATH}\"
    }" | tail -1
}

# ─── Step 1: Create Starter folder ──────────────────────────────
echo ""
echo "📁 Setting up folder structure..."
create_folder "${DAM_PATH}" "starter"
STARTER_PATH="${DAM_PATH}/starter"

# ─── Step 2: List existing models to get their IDs ───────────────
echo ""
echo "📋 Looking up existing CF model IDs..."

# Get all models and find our models
MODELS_JSON=$(curl -s "${AEM_HOST}/adobe/sites/cf/models" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "X-Adobe-Accept-Experimental: 1")

# Parse model IDs using python
python3 -c "
import json, sys
data = json.loads('''${MODELS_JSON}'''.replace('\n',''))
items = data.get('items', [])
found = {}
for m in items:
    title = m.get('title','').lower()
    found[title] = m.get('id','')
    print(f'  Found model: {m.get(\"title\")} -> {m.get(\"id\",\"\")[:30]}...')
" 2>/dev/null || echo "  ⚠️  Could not parse models JSON — will try to create fragments with model paths"

# ─── Step 3: Create sample Hero fragment ─────────────────────────
echo ""
echo "🎨 Creating sample content fragments..."

# Get the Hero model ID
HERO_MODEL_ID=$(echo "$MODELS_JSON" | python3 -c "
import json,sys
data=json.loads(sys.stdin.read())
items=data.get('items',[])
for m in items:
    if m.get('title','').lower() == 'hero':
        print(m['id'])
        break
" 2>/dev/null)

# Get Container model ID
CONTAINER_MODEL_ID=$(echo "$MODELS_JSON" | python3 -c "
import json,sys
data=json.loads(sys.stdin.read())
items=data.get('items',[])
for m in items:
    if m.get('title','').lower() == 'container':
        print(m['id'])
        break
" 2>/dev/null)

# Get Title model ID  
TITLE_MODEL_ID=$(echo "$MODELS_JSON" | python3 -c "
import json,sys
data=json.loads(sys.stdin.read())
items=data.get('items',[])
for m in items:
    if m.get('title','').lower() in ('title', 'titlemodel'):
        print(m['id'])
        break
" 2>/dev/null)

echo "  Hero Model ID: ${HERO_MODEL_ID:-NOT FOUND}"
echo "  Container Model ID: ${CONTAINER_MODEL_ID:-NOT FOUND}"
echo "  Title Model ID: ${TITLE_MODEL_ID:-NOT FOUND}"

# Create Hero fragment
if [ -n "$HERO_MODEL_ID" ]; then
  create_fragment "$STARTER_PATH" "Welcome Hero" "$HERO_MODEL_ID" '[
    {"name": "title", "type": "text", "value": "Welcome to Starter Studio"}
  ]'
fi

# Create Title fragment
if [ -n "$TITLE_MODEL_ID" ]; then
  create_fragment "$STARTER_PATH" "Our Services" "$TITLE_MODEL_ID" '[
    {"name": "title", "type": "text", "value": "Our Services"}
  ]'
fi

# Create Homepage container
if [ -n "$CONTAINER_MODEL_ID" ]; then
  create_fragment "$STARTER_PATH" "Homepage" "$CONTAINER_MODEL_ID" '[
    {"name": "title", "type": "text", "value": "Starter Studio Homepage"}
  ]'
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Go to AEM Author and verify fragments at: ${STARTER_PATH}"
echo "  2. Add the Hero/Title as references to the Homepage container"
echo "  3. Create a persisted GraphQL query for the homepage"
echo "  4. Update src/pages/HomePage.jsx with the correct query path"
