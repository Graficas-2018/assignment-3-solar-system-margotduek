var renderer = null,
scene = null,
camera = null,
sun = null,
solar_system = null,
sphere = null,
sphereTextured = null;

var materialName = "phong-textured";
var textureOn = true;

var duration = 10000; // ms
var currentTime = Date.now();

var materials = {};
var moon_map = "images/moon_1024.jpg";
var sun_map = "images/sunmap.jpg";
var mercury_map = "images/mercurymap.jpg"
var textureMap = null;
var mercuryTextureMap = null;

function animate()
{

    var now = Date.now();
    var deltat = now - currentTime;
    currentTime = now;
    var fract = deltat / duration;
    var angle = Math.PI * 2 * fract;

    // Rotate the sphere solar_system about its Y axis
    solar_system.rotation.y += angle;
}

function run()
{
    requestAnimationFrame(function() { run(); });

        // Render the scene
        renderer.render( scene, camera );

        // Spin the cube for next frame
        animate();
}

// Unlit (Basic Material) - With this material type, only the textures, colors, and transparency values are used to render the surface of the object. There is no contribution from lights in the scene.
// Phong shading - This material type implements a simple, fairly realistic-looking shading model with high performance. Phong-shaded objects will show brightly lit areas (specular reflections) where light hits directly, will light well along any edges that mostly face the light source, and will darkly shade areas where the edge of the object faces away from the light source.
// Lambertian reflectance - In Lambert shading, the apparent brightness of the surface to an observer is the same regardless of the observer’s angle of view.
function createMaterials()
{
    // Create a textre phong material for the cube
    // First, create the texture map
    textureMap = new THREE.TextureLoader().load(sun_map);
    mercuryTextureMap = new THREE.TextureLoader().load(mercury_map);

    materials["basic"] = new THREE.MeshBasicMaterial();
    materials["phong"] = new THREE.MeshPhongMaterial();
    materials["lambert"] = new THREE.MeshLambertMaterial();
    materials["basic-textured"] = new THREE.MeshBasicMaterial({ map: textureMap });
    materials["phong-textured"] = new THREE.MeshPhongMaterial({ map: textureMap });
    materials["lambert-textured"] = new THREE.MeshLambertMaterial({ map: textureMap });
}

// Changes the diffuse color of the material. The material’s diffuse color specifies how much the object reflects lighting sources that cast rays in a direction —that is, directional, point, and spotlights.
function setMaterialColor(r, g, b)
{
    r /= 255;
    g /= 255;
    b /= 255;

    materials["basic"].color.setRGB(r, g, b);
    materials["phong"].color.setRGB(r, g, b);
    materials["lambert"].color.setRGB(r, g, b);
    materials["basic-textured"].color.setRGB(r, g, b);
    materials["phong-textured"].color.setRGB(r, g, b);
    materials["lambert-textured"].color.setRGB(r, g, b);
}

// The specular color combines with scene lights to create reflected highlights from any of the object's vertices facing toward light sources.
function setMaterialSpecular(r, g, b)
{
    r /= 255;
    g /= 255;
    b /= 255;

    materials["phong"].specular.setRGB(r, g, b);
    materials["phong-textured"].specular.setRGB(r, g, b);
}

function setMaterial(name)
{
    materialName = name;
    if (textureOn)
    {
        sphere.visible = false;
        sphereTextured.visible = true;
        sphereTextured.material = materials[name];
    }
    else
    {
        sphere.visible = true;
        sphereTextured.visible = false;
        sphere.material = materials[name];
    }
}

function toggleTexture()
{
    textureOn = !textureOn;
    var names = materialName.split("-");
    if (!textureOn)
    {
        setMaterial(names[0]);
    }
    else
    {
        setMaterial(names[0] + "-textured");
    }
}

function toggleWireframe()
{
    materials["basic"].wireframe = !materials["basic"].wireframe;
    materials["phong"].wireframe = !materials["phong"].wireframe;
    materials["lambert"].wireframe = !materials["lambert"].wireframe;
    materials["basic-textured"].wireframe = !materials["basic-textured"].wireframe;
    materials["mercurio"].wireframe = !materials["mercurio"].wireframe;
    materials["phong-textured"].wireframe = !materials["phong-textured"].wireframe;
    materials["lambert-textured"].wireframe = !materials["lambert-textured"].wireframe;
}

function createScene(canvas)
{
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Create a new Three.js scene
    scene = new THREE.Scene();

    scene.background = new THREE.Color( 0.2, 0.2, 0.2 );

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.z = 30;
    scene.add(camera);

    // Create a solar_system to hold all the objects
    sun = new THREE.Object3D;

    // Add a directional light to show off the object
    var light = new THREE.DirectionalLight( 0xffffff, 2);

    // Position the light out from the scene, pointing at the origin
    light.position.set(.5, 0, 1);
    sun.add( light );

    light = new THREE.AmbientLight ( 0 ); // 0x222222 );
    sun.add(light);

    // Create a solar_system to hold the spheres
    solar_system = new THREE.Object3D;
    sun.add(solar_system);

    // Create all the materials
    createMaterials();

    // Create the sphere geometry
    geometry = new THREE.SphereGeometry(2, 20, 20);

    // And put the geometry and material together into a mesh
    sphere = new THREE.Mesh(geometry, materials["basic"]);
    sphere.visible = false;

    // Create the sphere geometry
    geometry = new THREE.SphereGeometry(2, 20, 20);

    // And put the geometry and material together into a mesh
    sphereTextured = new THREE.Mesh(geometry, materials["basic-textured"]);
    sphereTextured.visible = true;
    setMaterial("basic-textured");

    // Add the sphere mesh to our solar_system
    solar_system.add( sphere );
    solar_system.add( sphereTextured );




    // mercurio
    // Create the sphere geometry
    var mercurio = new THREE.Group();
    var geometry = new THREE.SphereGeometry(.2, 32, 32);
    var material = new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load("images/mercurymap.jpg"),
      bumpMap: new THREE.TextureLoader().load("images/mercurybump.jpg"),
      color: 0xDDDDDD,
      specular: 0x000000
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, -3);
    mesh.rotation.x = Math.PI / 2;
    mercurio.add(mesh);
    solar_system.add( mercurio );


    // venus
    // Create the sphere geometry
    var venus = new THREE.Group();
    var geometry = new THREE.SphereGeometry(.4, 32, 32);
    var material = new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load("images/venusmap.jpg"),
      bumpMap: new THREE.TextureLoader().load("images/venusbump.jpg"),
      color: 0xDDDDDD,
      specular: 0x000000
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(1, 0, -4);
    mesh.rotation.x = 0 * (Math.PI/180);
    mesh.rotation.y = 0 * (Math.PI/180);
    mesh.rotation.z = 33 * (Math.PI/180);

    // mesh.rotation.x = Math.PI / 2;
    venus.add(mesh);
    solar_system.add( venus );


    // earth
    // Create the sphere geometry
    var earth = new THREE.Group();
    var geometry = new THREE.SphereGeometry(.4, 32, 32);
    var material = new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load("images/earthmap1k.jpg"),
      bumpMap: new THREE.TextureLoader().load("images/earthbump1k.jpg"),
      color: 0xDDDDDD,
      specular: 0x000000
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(-1, 0, -5);
    mesh.rotation.x = Math.PI / 2;
    earth.add(mesh);
    solar_system.add( earth );

    // mars
    // Create the sphere geometry
    var mars = new THREE.Group();
    var geometry = new THREE.SphereGeometry(.2, 32, 32);
    var material = new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load("images/mars_1k_color.jpg"),
      bumpMap: new THREE.TextureLoader().load("images/marsbump1k.jpg"),
      color: 0xDDDDDD,
      specular: 0x000000
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set( 3, 0, -5.2);
    mesh.rotation.x = Math.PI / 2;
    mars.add(mesh);
    solar_system.add( mars );

    // jupiter
    // Create the sphere geometry
    var jupiter = new THREE.Group();
    var geometry = new THREE.SphereGeometry(.9, 32, 32);
    var material = new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load("images/jupitermap.jpg"),
      color: 0xDDDDDD,
      specular: 0x000000
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(6, 0, -3.5);
    mesh.rotation.x = Math.PI / 2;
    jupiter.add(mesh);
    solar_system.add( jupiter );

    // saturn
    // Create the sphere geometry
    var saturn = new THREE.Group();
    var geometry = new THREE.SphereGeometry(.9, 32, 32);
    var material = new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load("images/saturnmap.jpg"),
      color: 0xDDDDDD,
      specular: 0x000000
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, -8);
    mesh.rotation.x = Math.PI / 33;
    saturn.add(mesh);
    solar_system.add( saturn );

    // uranus
    // Create the sphere geometry
    var uranus = new THREE.Group();
    var geometry = new THREE.SphereGeometry(.5, 32, 32);
    var material = new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load("images/uranusmap.jpg"),
      color: 0xDDDDDD,
      specular: 0x000000
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, -9);
    mesh.rotation.x = Math.PI / 2;
    uranus.add(mesh);
    solar_system.add( uranus );


    // neptune
    // Create the sphere geometry
    var neptune = new THREE.Group();
    var geometry = new THREE.SphereGeometry(.4, 32, 32);
    var material = new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load("images/neptunemap.jpg"),
      color: 0xDDDDDD,
      specular: 0x000000
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, -10);
    mesh.rotation.x = Math.PI / 2;
    neptune.add(mesh);
    solar_system.add( neptune );


    // pluto
    // Create the sphere geometry
    var pluto = new THREE.Group();
    var geometry = new THREE.SphereGeometry(.2, 32, 32);
    var material = new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load("images/plutomap1k.jpg"),
      bumpMap: new THREE.TextureLoader().load("images/plutobump1k.jpg"),
      color: 0xDDDDDD,
      specular: 0x000000
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, -11);
    mesh.rotation.x = Math.PI / 2;
    pluto.add(mesh);
    solar_system.add( pluto );

    // Create the orbita geometry
    var orbita = new THREE.TorusGeometry( 3, .1, 16, 100 );

    // And put the orbita and material together into a mesh
    orbita_mercurio = new THREE.Mesh(orbita, materials["phong"]);

    // Move the orbita_mercurio up and out from the sphere
    orbita_mercurio.position.set(0, 0, 0);
    orbita_mercurio.rotation.set(1.57, 0, 0);

    // Add the orbita_venus mesh to our solar_system
    solar_system.add( orbita_mercurio );


    // Create the orbita-venus geometry
    var orbita = new THREE.TorusGeometry( 4, .1, 16, 100 );

    // And put the orbita and material together into a mesh
    orbita_venus = new THREE.Mesh(orbita, materials["phong"]);

    // Move the orbita_venus up and out from the sphere
    orbita_venus.position.set(0, 0, 0);
    orbita_venus.rotation.set(1.57, 0, 0);

    // Add the orbita_venus mesh to our solar_system
    solar_system.add( orbita_venus );



    // Create the orbita-tierra geometry
    var orbita = new THREE.TorusGeometry( 5, .1, 16, 100 );

    // And put the orbita and material together into a mesh
    orbita_tierra = new THREE.Mesh(orbita, materials["phong"]);

    // Move the orbita_tierra up and out from the sphere
    orbita_tierra.position.set(0, 0, 0);
    orbita_tierra.rotation.set(1.57, 0, 0);

    // Add the orbita_tierra mesh to our solar_system
    solar_system.add( orbita_tierra );



    // Create the orbita-marte geometry
    var orbita = new THREE.TorusGeometry( 6, .1, 16, 100 );

    // And put the orbita and material together into a mesh
    orbita_marte = new THREE.Mesh(orbita, materials["phong"]);

    // Move the orbita_marte up and out from the sphere
    orbita_marte.position.set(0, 0, 0);
    orbita_marte.rotation.set(1.57, 0, 0);

    // Add the orbita_marte mesh to our solar_system
    solar_system.add( orbita_marte );



    // Create the orbita-jupiter geometry
    var orbita = new THREE.TorusGeometry( 7, .1, 16, 100 );

    // And put the orbita and material together into a mesh
    orbita_jupiter = new THREE.Mesh(orbita, materials["phong"]);

    // Move the orbita_jupiter up and out from the sphere
    orbita_jupiter.position.set(0, 0, 0);
    orbita_jupiter.rotation.set(1.57, 0, 0);

    // Add the orbita_jupiter mesh to our solar_system
    solar_system.add( orbita_jupiter );


    // Create the orbita-saturno geometry
    var orbita = new THREE.TorusGeometry( 8, .1, 16, 100 );

    // And put the orbita and material together into a mesh
    orbita_saturno = new THREE.Mesh(orbita, materials["phong"]);

    // Move the orbita_saturno up and out from the sphere
    orbita_saturno.position.set(0, 0, 0);
    orbita_saturno.rotation.set(1.57, 0, 0);

    // Add the orbita_saturno mesh to our solar_system
    solar_system.add( orbita_saturno );


    // Create the orbita-urano geometry
    var orbita = new THREE.TorusGeometry( 9, .1, 16, 100 );

    // And put the orbita and material together into a mesh
    orbita_urano = new THREE.Mesh(orbita, materials["phong"]);

    // Move the orbita_urano up and out from the sphere
    orbita_urano.position.set(0, 0, 0);
    orbita_urano.rotation.set(1.57, 0, 0);

    // Add the orbita_urano mesh to our solar_system
    solar_system.add( orbita_urano );



    // Create the orbita-neptuno geometry
    var orbita = new THREE.TorusGeometry( 10, .1, 16, 100 );
    // And put the orbita and material together into a mesh
    orbita_neptuno = new THREE.Mesh(orbita, materials["phong"]);
    // Move the orbita_neptuno up and out from the sphere
    orbita_neptuno.position.set(0, 0, 0);
    orbita_neptuno.rotation.set(1.57, 0, 0);
    // Add the orbita_neptuno mesh to our solar_system
    solar_system.add( orbita_neptuno );

    // Create the orbita-pluton geometry
    var orbita = new THREE.TorusGeometry( 11, .1, 16, 100 );
    // And put the orbita and material together into a mesh
    orbita_pluton = new THREE.Mesh(orbita, materials["phong"]);
    // Move the orbita_pluton up and out from the sphere
    orbita_pluton.position.set(0, 0, 0);
    orbita_pluton.rotation.set(1.57, 0, 0);
    // Add the orbita_pluton mesh to our solar_system
    solar_system.add( orbita_pluton );


    // Now add the solar_system to our scene
    scene.add( sun );
}

function rotateScene(deltay)
{
    sun.rotation.x += deltay / 100;
    $("#rotation").html("rotation: 0," + sun.rotation.y.toFixed(2) + ",0");
}

function scaleScene(scale)
{
    sun.scale.set(scale, scale, scale);
    $("#scale").html("scale: " + scale);
}
