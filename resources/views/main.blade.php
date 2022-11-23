<!DOCTYPE html>
<html lang="en" data-kit-theme="default">

<head>
    @include("shared.header")
    @include("shared.websocket")
    @routes('main', csp_nonce())
    @include("shared.context")

    <title>{{config('app.name')}}</title>
</head>

<body>

@include("shared.content")

<script type="text/javascript" src="{{mix('js/main.js')}}"></script>
</body>

</html>
