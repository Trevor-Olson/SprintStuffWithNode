// checks the appropriate filter boxes
function isChecked(){
    var searchParams = new URLSearchParams(window.location.search)
    if( searchParams.get( 'category' ) == 'Winged' )
    {
        document.getElementById('Winged').setAttribute('checked', 'true')
    }
    else if( searchParams.get( 'category' ) == 'Non-Winged' )
    {
        document.getElementById('Non-Winged').setAttribute('checked', 'true')
    }
    if( searchParams.get( 'type' ) == 'Clothing' )
    {
        document.getElementById('Clothing').setAttribute('checked', 'true')
    }
    else if( searchParams.get( 'type' ) == 'Hand-Painted' )
    {
        document.getElementById('Hand-Painted').setAttribute('checked', 'true')
    }
}
window.onchange = isChecked();