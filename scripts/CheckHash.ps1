$uri = 'https://cdn.azul.com/zulu/bin/zulu8.70.0.23-ca-jdk8.0.372-linux_x64.tar.gz'
$name = 'zulu8.70.0.23-ca-jdk8.0.372-linux_x64'
$req = Invoke-WebRequest $uri

# get the remote file hash
$remoteHash = Get-FileHash -InputStream $req.RawContentStream -Algorithm SHA256

Write-Host $remoteHash

$remoteHash | Out-File $env:USERPROFILE\Documents\$name.hash.txt -encoding ascii
