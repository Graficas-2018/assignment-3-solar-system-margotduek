var mouseDown = false,
pageY = 0;

function onMouseMove(evt)
{
    if (!mouseDown)
        return;

    evt.preventDefault();

    var deltay = evt.pageY - pageY;
    pageY = evt.pageY;
    rotateScene(deltay);
}

function onMouseDown(evt)
{
    evt.preventDefault();

    mouseDown = true;
    pageY = evt.pageY;
}

function onMouseUp(evt)
{
    evt.preventDefault();

    mouseDown = false;
}

function addMouseHandler(canvas)
{
canvas.addEventListener( 'mousemove',
        function(e) { onMouseMove(e); }, false );
canvas.addEventListener( 'mousedown',
        function(e) { onMouseDown(e); }, false );
canvas.addEventListener( 'mouseup',
        function(e) { onMouseUp(e); }, false );
}

function initControls()
{
    $("#slider").slider({min: 0, max: 2, value: 1, step: 0.01, animate: false});
    $("#slider").on("slide", function(e, u) {
        scaleScene(u.value);
        });


    $("input[name=materialRBGroup]").click(
                function() {
                    var id = $("input[name=materialRBGroup]:checked").attr('value');
                    if (textureOn)
                    {
                        setMaterial(id + "-textured");
                    }
                    else
                    {
                        setMaterial(id);
                    }

                }
            );
    $("#wireframeCheckbox").click(
            function() { toggleWireframe(); }
        );


    $('#diffuseColor').ColorPicker({
        color: '#ffffff',
        onShow: function (colpkr) {
            $(colpkr).fadeIn(500);
            return false;
        },
        onHide: function (colpkr) {
            $(colpkr).fadeOut(500);
            return false;
        },
        onChange: function (hsb, hex, rgb) {
            $('#diffuseColor div').css('backgroundColor', '#' + hex);
            setMaterialColor(rgb.r, rgb.g, rgb.b);
        },
        onSubmit: function(hsb, hex, rgb, el) {
            $(el).val(hex);
            $('#diffuseColor div').css( "background-color", "#" + hex );
            setMaterialColor(rgb.r, rgb.g, rgb.b);
            $(el).ColorPickerHide();
        },
    });
    var diffuseHex = "#ffffff";
    $('#diffuseColor').ColorPickerSetColor(diffuseHex);
    $('#diffuseColor div').css( "background-color", diffuseHex );

    $('#specularColor').ColorPicker({
        color: '#ffffff',
        onShow: function (colpkr) {
            $(colpkr).fadeIn(500);
            return false;
        },
        onHide: function (colpkr) {
            $(colpkr).fadeOut(500);
            return false;
        },
        // Callback function triggered when the color is changed. This is the function that allows you to get the color picked by the user whenever it changes, whithout the user pressing the OK button
        onChange: function (hsb, hex, rgb) {
            $('#specularColor div').css('backgroundColor', '#' + hex);
            setMaterialSpecular(rgb.r, rgb.g, rgb.b);
        },
        // Callback function triggered when the color is chosen by the user, using the OK button
        onSubmit: function(hsb, hex, rgb, el) {
            $(el).val(hex);
            $('#specularColor div').css( "background-color", "#" + hex );
            setMaterialSpecular(rgb.r, rgb.g, rgb.b);
            $(el).ColorPickerHide();
        },
    });
    var specularHex = "#111111";
    $('#specularColor').ColorPickerSetColor(specularHex);
    $('#specularColor div').css( "background-color", specularHex );

    $("#textureUrl").html(sun_map);
    $("#texture").css( "background-image", "url(" + sun_map + ")");

    $("#textureCheckbox").click(
            function() { toggleTexture(); }
        );

}
