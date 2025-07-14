# Replace these variables with your actual values
GITLAB_TOKEN="{KEY}"
PROJECT_ID="66075338"
VERSION="0.0.0"
FILE_PATH="./release/association-club_0.0.0_amd64.deb"  # or your actual file path

# Upload file
curl -v --header "PRIVATE-TOKEN: ${GITLAB_TOKEN}" \
     --upload-file ${FILE_PATH} \
     "https://gitlab.com/api/v4/projects/${PROJECT_ID}/packages/generic/association-club/${VERSION}/association-club_${VERSION}_amd64.deb"

# To verify the upload (optional)
curl -v --header "PRIVATE-TOKEN: ${GITLAB_TOKEN}" \
     "https://gitlab.com/api/v4/projects/${PROJECT_ID}/packages"
