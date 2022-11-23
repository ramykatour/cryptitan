<meta charset="utf-8"/>
<meta name="csrf-token" content="{{csrf_token()}}">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
<link href="//fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<script src="//polyfill.io/v3/polyfill.min.js" type="text/javascript"></script>

@if(!$favicon = $settings->brand->get("favicon_url"))
    <link rel="shortcut icon" href="{{asset('favicon.png')}}"/>
@else
    <link rel="shortcut icon" href="{{$favicon}}"/>
@endif