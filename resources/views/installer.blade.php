<!DOCTYPE html>
<html lang="en" data-kit-theme="default">

<head>
    @include("shared.header")
    @routes('installer', csp_nonce())
    @include("shared.context")

    <title>Cryptitan Installer</title>
</head>

<body>

@include("shared.content")

<script type="text/javascript" src="{{mix('js/main.js')}}"></script>
</body>

</html>
