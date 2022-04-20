function editUrlParameter(name, value) {
    var searchParams = new URLSearchParams(window.location.search)
    if( searchParams.get( name ) == value )
    {
        searchParams.delete( name )
    }
    else
    {
        searchParams.set(name, value)
    }
    window.location.search = searchParams.toString()
}

function removeUrlParameters() {
    window.location.search = "";
}
