#!/bin/bash
#
# Setup script untuk Vercel deployment
# Usage: ./scripts/setup-vercel.sh

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}     Vercel Deployment Setup Script     ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel > /dev/null 2>&1; then
    echo -e "${YELLOW}Installing Vercel CLI...${NC}"
    npm install -g vercel@latest
fi

# Check if logged in
echo -e "${BLUE}Checking Vercel login status...${NC}"
if ! vercel whoami > /dev/null 2>&1; then
    echo -e "${YELLOW}Please login to Vercel:${NC}"
    vercel login
fi

ORG_ID=$(vercel whoami)
echo -e "${GREEN}✓ Logged in as: $ORG_ID${NC}"
echo ""

# Get Team/Org ID
echo -e "${BLUE}Getting Team ID...${NC}"
# Try to get from auth file
if [ -f "$HOME/.local/share/vercel/auth.json" ]; then
    TEAM_ID=$(cat "$HOME/.local/share/vercel/auth.json" | grep -oP '"teamId": "\K[^"]+' || echo "")
fi

if [ -z "$TEAM_ID" ]; then
    echo -e "${YELLOW}Could not auto-detect Team ID${NC}"
    echo "Please create your projects manually on Vercel Dashboard first"
    echo "Then add these secrets to GitHub:"
    echo ""
fi

echo ""
echo -e "${BLUE}Setting up projects...${NC}"
echo ""

# Setup function
setup_project() {
    local dir=$1
    local name=$2
    local project_id_var=$3
    
    echo -e "${BLUE}[$name]${NC} Checking project..."
    
    if [ -d "$dir/.vercel" ]; then
        echo -e "${GREEN}✓ $name already linked${NC}"
    else
        echo -e "${YELLOW}Linking $name project...${NC}"
        cd "$dir"
        vercel link --yes --project="$name" || {
            echo -e "${YELLOW}Project not found. Creating new project...${NC}"
            vercel --yes --name="$name"
        }
        cd - > /dev/null
    fi
    
    # Get project ID
    if [ -f "$dir/.vercel/project.json" ]; then
        local project_id=$(cat "$dir/.vercel/project.json" | grep -oP '"projectId": "\K[^"]+')
        echo -e "${GREEN}✓ Project ID: $project_id${NC}"
        echo "$project_id_var=$project_id"
    fi
    echo ""
}

# Setup each project
setup_project "apps/api" "ningclean-api" "VERCEL_API_PROJECT_ID"
setup_project "apps/admin" "ningclean-admin" "VERCEL_ADMIN_PROJECT_ID"
setup_project "apps/web" "ningclean-web" "VERCEL_WEB_PROJECT_ID"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}     Setup Complete!                   ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Go to GitHub Repository Settings > Secrets and variables > Actions"
echo "   URL: https://github.com/gelewog/ningclean/settings/secrets/actions"
echo ""
echo "2. Add these secrets:"
echo ""
echo "   Name: VERCEL_TOKEN"
echo "   Value: (Get from https://vercel.com/account/tokens)"
echo ""
echo "   Name: VERCEL_ORG_ID"
echo "   Value: (Get from vercel teams list or auth.json)"
echo ""
echo "   Name: VERCEL_API_PROJECT_ID"
echo "   (from apps/api/.vercel/project.json)"
echo ""
echo "   Name: VERCEL_ADMIN_PROJECT_ID"
echo "   (from apps/admin/.vercel/project.json)"
echo ""
echo "   Name: VERCEL_WEB_PROJECT_ID"
echo "   (from apps/web/.vercel/project.json)"
echo ""
echo "   Name: NEXT_PUBLIC_API_URL"
echo "   Value: https://your-api-domain.vercel.app"
echo ""
echo "3. Push to master to trigger deployment!"
echo ""
