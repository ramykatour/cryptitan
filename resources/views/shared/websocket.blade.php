@switch(config('broadcasting.default'))
    @case("pusher")
        <script src="{{asset('vendor/pusher.js')}}" type="text/javascript"></script>
        @break
    @case("redis")
        <script src="{{asset('vendor/socket.js')}}" type="text/javascript"></script>
        @break
@endswitch