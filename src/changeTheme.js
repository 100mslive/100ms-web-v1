export function changeToSecondaryColor(el){
    if (el&&process.env.NEXT_PUBLIC_SECONDARY_COLOR) {
        let shouldTextBeBlack=getContrastYIQ(process.env.NEXT_PUBLIC_SECONDARY_COLOR)
        el.style.setProperty('background-color', process.env.NEXT_PUBLIC_SECONDARY_COLOR, 'important');
        shouldTextBeBlack? el.style.setProperty('color', 'black',"important"):el.style.setProperty('color', 'white', "important")
        el.style.setProperty('border-color', '#FFFFFF', "important")
    }
}


export function getContrastYIQ(hexcolor){
    if(!hexcolor)
        return false
    hexcolor = hexcolor.replace("#", "");
    var r = parseInt(hexcolor.substr(0,2),16);
    var g = parseInt(hexcolor.substr(2,2),16);
    var b = parseInt(hexcolor.substr(4,2),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128);
}
