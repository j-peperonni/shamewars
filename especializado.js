//=============
// |indice
// Atajo a secciones introduciendo '|' + 'nombre seccion' en el buscador de texto
//=============
/*
|especializado

 |loader                     gestor de carga de recursos                      
  |load_isc                  isc  = imagen sonido clase
  |load_isct                 isct = imagen sonido clase 'three'(libreria externa 'three.js')
 |skin                       control de aspecto de ventanas/botones
 |escenario                  controlador de escenas
 |enterframe                 
   |enterload
   |enterframe_recursivo
 |teclado
 |audio                      sumamente incompleto; permite carga basica de sonidos
 |cursor                     relativo al mouse
 |game                       gestor de juegos
 |ventana                    
 |menu                       barra de menu
 |slideshow                  control de 'transiciones' visuales (codigo antiguo, usar con precaucion)
 |form                       relativo a elementos de formulario (text_input, botones, etc...)
 |debug                      miscelaneo
*/



//|especializado
var _ESPECIALIZADO =
{
  //'|atajos'
  LOAD_ISC()
  {
   return(LOADER.LOAD_ISC(...arguments  ))
  },
  LOAD_ISCT()
  {
   return(LOADER.LOAD_ISCT(...arguments  ))
  },


  //|loader
  LOADER:
  {
  //|load_isc
  //       Imagen[],   sonido[],   textos(clases)[]
  //           |       |           |   
  LOAD_ISC(f_images, f_sounds, f_clases, f_donde, f_callback) {

    LOADER.cargar_recursos({
      images: f_images,
      sounds: f_sounds,
      clases: f_clases,
      },

      f_donde,
      f_callback,
    );

  },//fin load_isc

  //|load_isct
  //                                        ['url','url']
  //                                        [{map:"", },{}]
  //                                          |
  LOAD_ISCT(f_images, f_sounds, f_clases, f_three,
    f_donde, f_callback) {
    function _three_ok() //modulo three cargado o existente
    {

      let _textures = [];
      let _materials = [];
      //{map:'/_recursos/draw_01.png', transparent:true},

      for (var u of f_three) {
        let _tex;
        let _mat;
        if (get_type(u) == 'string') {
          _tex = _THREE.texture_loader.load(u);

          _mat = {
            map: _tex,
            //                //FrontSide  BackSide  DoubleSide
            side: THREE.DoubleSide,

            transparent: false,

            _lambert: 0,
          }

        }
        else if (get_type(u) == 'object') //{map:"url", ...}
        {

          _mat = setloop_prop(
            {
              map: "",
              side: THREE.DoubleSide,
              transparent: false,

              _lambert: 0,
            },

            u
          );
          _tex = _THREE.texture_loader.load(u.map);
          _mat.map = _tex;

        }
        if (_mat._lambert == 0) {
          delete (_mat._lambert)
          _mat = new THREE.MeshBasicMaterial(_mat);
        }
        if (_mat._lambert == 1) {
          delete (_mat._lambert)
          _mat = new THREE.MeshLambertMaterial(_mat);
        }

        _materials.push(_mat);
        _textures.push(_tex);

      }



      LOADER.cargar_recursos(
        {
          images: f_images,
          sounds: f_sounds,
          clases: f_clases,

        },
        f_donde,

        function (e) {
          f_donde.LIB.TEXTURES = _textures;
          f_donde.LIB_TEXTURES = _textures;
          f_donde.LIB.MATERIALS = _materials;
          f_donde.LIB_MATERIALS = _materials;

          f_callback(e);
        }

      );

    }//_three_ok

    if (_root['_THREE'] == undefined) {

      let _script = cargar_script("/scripts/_three.js", "_", "module"); //en script se define TC
      _script.onload = function () {
        _three_ok();
      }

    }
    else {
      _three_ok();
    }


  },//fin_load_isct



    //no se recomienda llamar directamente; en su lugar emplear 'load_isc' 
    cargar_recursos(f_data, f_donde, f_callback) {

      let _data = setloop_prop(
        {
          images: [], 
          sounds: [],
          clases: [],

          LIB:   
          {
            IMAGES: [],
            CLASES: [],
            SOUNDS: [],
          },

          callback: f_callback,

          total: "",

          check() {

            if (this.total == 0) //al terminar carga
            {
              console.log("LOAD: end")

              f_donde.LIB_IMAGES = this.LIB.IMAGES;
              f_donde.LIB_SOUNDS = this.LIB.SOUNDS;
              f_donde.LIB_CLASES = this.LIB.CLASES;

              //f_donde.THREE = foo.THREE;

              f_donde.LIB = {
                IMAGES: f_donde.LIB_IMAGES,
                SOUNDS: f_donde.LIB_SOUNDS,
                CLASES: f_donde.LIB_CLASES,

                play(f_buffer, f_pitch = 0, f_loop = 0) {
                  AUDIO.play_sample(this.SOUNDS[f_buffer], f_pitch, f_loop);

                },
                get_class(f_id) {
                  return (clone_object(this.CLASES[f_id]));
                },

              }

              //set $ de LIB               
              if(f_donde.$ ==undefined)
                 f_donde.$={};
              f_donde.$.LIB = f_donde.LIB;
              _root.set_$(f_donde);

              if (f_donde._onrecursosload !== undefined) // no tocar; metafuncion objectos especiales (ventanes, etc)  
              {
                f_donde._onrecursosload();
              }

              //

              bindear(f_callback, f_donde);


            }

          },

          ok_class(e_class, e_script) //e_class = objecto encontrado; e_script = script tag
          {
            //workaround callback cargar_txt (este envia de callback argumento TEXTO, TITULO, TAG)
            if (arguments[2] !== undefined) e_script = arguments[2];

            let _index = e_script.LIB_INDEX;

            this.LIB.CLASES[_index] = e_class;

            this.total--;
            this.check();
          },
          ok_image(e) {
            let _index = e.LIB_INDEX;

            this.LIB.IMAGES[_index] = e;
            this.total--;
            this.check();
          },
          ok_sound(e_buffer, e_request) //request contiene LIB_INDEX
          {
            let _index = e_request.LIB_INDEX;

            this.LIB.SOUNDS[_index] = e_buffer;

            this.total--;
            this.check();
          },

        },
        f_data
      );

      _data.LIB.IMAGES = new_array(_data.images.length, "");
      _data.LIB.SOUNDS = new_array(_data.sounds.length, "");
      _data.LIB.CLASES = new_array(_data.clases.length, "");


      _data.total = _data.images.length + _data.sounds.length + _data.clases.length;



      //imagenes
      let i = 0;
      for (var u of _data.images) {

        let _image = cargar_imagen(u, bindear_(_data.ok_image, _data), { flip_x: 1, flip_y: 1 });
        _image.LIB_INDEX = i;
        i++;
      }

      //clases
      i = 0;
      for (var u of _data.clases) {
        let _ext = get_extension(u);

        //segregar de acuerdo a tipo de archivo
        if (_ext == 'js') {
          let _script = cargar_script(u, bindear_(_data.ok_class, _data, 0));
          _script.LIB_INDEX = i;
        }
        else if (_ext == 'json')                        //se parsea texto cargado 
        {                                               //              |
          let _script = cargar_txt(u, bindear_(_data.ok_class, _data), 1);
          _script.LIB_INDEX = i;

        }
        else {
          let _script = cargar_txt(u, bindear_(_data.ok_class, _data));
          _script.LIB_INDEX = i;
        }



        i++;
      }


      //sonidos
      i = 0;
      for (var u of _data.sounds) {

        let _audio = AUDIO.load_sample(u, bindear_(_data.ok_sound, _data))

        _audio.LIB_INDEX = i;
        i++;
      }


      _data.check();



    }, //end cargar_recursos





  },//end LOAD




  cargar_imagen(f_url, f_callback, f_data)//f_arr_data=["nombre propiedad",valor]
  {

    let _data = setloop_prop(
      {
        flip_x: 1,
        flip_y: 0,
      },

      f_data
    )

    var _img = new Image(10, 10);
    _img._nosetloop = 1;


    _img.src = f_url;
    _img.src_short = f_url; //src es modifica tras carga; src_short = original
    _img.flip = {};

    _img.callback = f_callback;


    _img.onload = function () {


      _img.width = _img.naturalWidth;
      _img.height = _img.naturalHeight;

      if (_data.flip_x !== 1 && _data.flip_y !== 1)
        _img.callback(_img);

      else {
        if (_data.flip_x) {
          //flip_image = return img obj cargandose
          flip_image(_img, 'x').onload = function () {
            _img.flip.x = this;
            _img.flip_x = [_img, this];

            if (_data.flip_y == 0 || _data.flip_y == 1 && _img.flip.y !== undefined)
              _img.callback(_img);

          }
        }

        if (_data.flip_y) {
          flip_image(_img, 'y').onload = function () {
            _img.flip.y = this;
            _img.flip_y = [_img, this];

            if (_data.flip_x == 0 || _data.flip_x == 1 && _img.flip.y !== undefined)
              _img.callback(_img);

          }
        }


      }

    }

    return (_img);

  },


  //===============================
  // |skin
  //===============================

  SKIN:
  {

    act: 'silver',

    set(f_name = 'default') {
      this.act = f_name;
    },

    get_ventana(f_name = this.act) {
      return (clone_object(this[f_name].ventana));
    },

    get_menu(f_name = this.act) {
      return (clone_object(this[f_name].menu));
    },

    add(f_name, f_data, f_set = 0) {

      let _skin = setloop_prop(clone_object(this.default), f_data);


      this[f_name] = _skin;

      if (f_set)
        this.set(f_name)
    },


    default:
    {
      ventana:
      {
        //odiv ventana principal
        borde: [4, 4, 4, 4],

        main:
        {
          style: { background: "white", borderRadius: "10px 10px 0px 0px", border: "1px solid lightgray", borderBottom: "5px solid #616161", /*  boxShadow:"-5px 10px 10px rgba(0, 0, 0, .05)",*/ userSelect: "none" },
        },

        macrobloque:
        {                                            //, overflow:'visible'
          style: { borderRadius: '0px', border: "none", background: "white" },
        },

        bloque: {
          style: { background: 'white', border: '1px solid black' },
        },

        header: {
          style: { border: 'none', overflow: 'visible' },

          titulo: {
            style: { background: 'lightgray', borderRadius: '5px', border: '1px solid lightgray' },
            h: 30,

            texto: {
              style: { background: 'none', border: "none", display: "flex", padding: '4px', alignItems: 'center', whiteSpace: 'nowrap', overflow: "hidden" },
            },

            xb: {
              style: { background: 'white', border: 'none' },
              x: 0, y: 0, w: 30, h: 30, img: "scripts/bx.png",
            },



          },

          menu: {
            style: { background: 'white', border: 'none', borderLeft: 'none', borderRight: 'none' },
            h: 25,
          },

        },



      },

      menu:
      {

        style: { background: 'white', border: 'none', borderBottom: '2px solid black' }, //barra

        header:
        {
          //x w_add  //y padding
          margen_interno: [5, 5, '50%'],
          margen_externo: [1, 0], //|_[], | []_[]_[]
          h: [2, 0],

          style:
          {
            macro: { border: '1px solid white', background: 'white' },

            normal: { background: 'white' },
            hover: { background: 'lightgray', border: '1px solid lightgray' },
            click: { background: 'gray', border: '1px solid gray' },

          },
        },

        racimo:
        {
          w: 100,
          h: 25,
          margen_interno: [10, 10],
          style:
          {
            macro: [
              { background: 'white', borderLeft: '1px solid lightgray', borderTop: 'none', borderRight: '1px solid lightgray', borderBottom: 'none' },
              { background: 'white', borderLeft: '1px solid lightgray', borderTop: 'none', borderRight: '1px solid lightgray', borderBottom: 'none' },
              { background: 'white', borderLeft: '1px solid lightgray', borderTop: 'none', borderRight: '1px solid lightgray', borderBottom: '2px solid gray' },
            ],

            normal: { background: 'white' },
            hover: { background: 'lightgray' },

            special:
            {
              hr: { h: 20, borderTop: '1px solid gray' }, //linea horizontal via $LINE[]
            }

          },

        },


      },//fin menu

    },//fin default


    classic:
    {
      ventana:
      {
        //odiv ventana principal
        borde: [4, 4, 4, 4],

        main:
        {
          style: { background: "white", borderRadius: "0px", border: "1px solid black", borderBottom: "3px solid black", userSelect: "none" },
        },

        macrobloque:
        {                                            //, overflow:'visible'
          style: { borderRadius: '0px', border: "none", background: "white" },
        },

        bloque: {
          style: { background: 'white', border: '1px solid black' },
        },

        header: {
          style: { border: 'none', overflow: 'visible' },

          titulo: {
            style: { background: 'lightgray', borderBottom: '2px solid black' },
            h: 30,

            texto: {
              style: { background: 'none', border: "none", display: "flex", padding: '4px', alignItems: 'center', whiteSpace: 'nowrap', overflow: "hidden" },
            },

            xb: {
              style: { background: 'white' },
              x: 0, y: 0, w: 30, h: 30, img: "scripts/bx.png",
            },



          },

          menu: {
            style: { background: 'white', border: '1px solid black', borderLeft: 'none', borderRight: 'none' },
            h: 25,
          },

        },



      },

      menu:
      {

        style: { background: 'white', border: 'none', borderBottom: '2px solid black' }, //barra

        header:
        {
          //x w_add  //y padding
          margen_interno: [5, 5, '50%'],
          margen_externo: [1, 0], //|_[], | []_[]_[]
          h: [2, 0],

          style:
          {
            macro: { border: '1px solid white', background: 'white' },

            normal: { background: 'white' },
            hover: { background: 'lightgray', border: '1px solid lightgray' },
            click: { background: 'gray', border: '1px solid gray' },

          },
        },

        racimo:
        {
          w: 100,
          h: 25,
          margen_interno: [10, 10],
          style:
          {
            macro: [
              { background: 'white', borderLeft: '1px solid black', borderTop: '1px solid black', borderRight: '1px solid black', borderBottom: 'none' },
              { background: 'white', borderLeft: '1px solid black', borderTop: 'none', borderRight: '1px solid black', borderBottom: 'none' },
              { background: 'white', borderLeft: '1px solid black', borderTop: 'none', borderRight: '1px solid black', borderBottom: '2px solid black' },
            ],

            normal: { background: 'white' },
            hover: { background: 'lightgray' },

            special:
            {
              hr: { h: 20, borderTop: '1px solid gray' }, //linea horizontal via $LINE[]
            }

          },

        },


      },//fin menu classic



    },//fin classic



    silver:
    {
      ventana:
      {
        //odiv ventana principal
        borde: [4, 4, 4, 4],

        main:
        {
          style: { background: "white", borderRadius: "0px", border: "1px solid gray", borderBottom: "5px solid black", /*  boxShadow:"-5px 10px 10px rgba(0, 0, 0, .05)",*/ userSelect: "none" },
        },

        macrobloque:
        {                                            //, overflow:'visible'
          style: { borderRadius: '0px', border: "none", background: "white" },
        },

        bloque: {
          style: { background: 'white', border: '1px solid black' },
        },

        header: {
          style: { border: 'none', overflow: 'visible' },

          titulo: {
            style: { background: 'lightgray', borderRadius: '0px', border: '1px solid lightgray', borderBottom: '1px solid lightgray' },
            h: 28,//30

            texto: {
              style: { background: 'none', border: "none", display: "flex", padding: '4px', alignItems: 'center', whiteSpace: 'nowrap', overflow: "hidden" },
            },

            xb: {
              style: { background: 'white', border: 'none' },
              x: 0, y: 0, w: 30, h: 30, img: "scripts/bx.png",
            },



          },

          menu: {
            style: { background: 'white', border: 'none', borderLeft: 'none', borderRight: 'none' },
            h: 25,
          },

        },



      },

      menu:
      {

        style: { background: 'white', border: 'none', borderBottom: '2px solid black' }, //barra

        header:
        {
          //x w_add  //y padding
          margen_interno: [5, 5, '50%'],
          margen_externo: [1, 0], //|_[], | []_[]_[]
          h: [2, 0],

          style:
          {
            macro: { border: '1px solid white', background: 'white' },

            normal: { background: 'white' },
            hover: { background: 'lightgray', border: '1px solid lightgray' },
            click: { background: 'gray', border: '1px solid gray' },

          },
        },

        racimo:
        {
          w: 100,
          h: 25,
          margen_interno: [10, 10],
          style:
          {
            macro: [
              { background: 'white', borderLeft: '1px solid lightgray', borderTop: 'none', borderRight: '1px solid lightgray', borderBottom: 'none' },
              { background: 'white', borderLeft: '1px solid lightgray', borderTop: 'none', borderRight: '1px solid lightgray', borderBottom: 'none' },
              { background: 'white', borderLeft: '1px solid lightgray', borderTop: 'none', borderRight: '1px solid lightgray', borderBottom: '2px solid gray' },
            ],

            normal: { background: 'white' },
            hover: { background: 'lightgray' },

            special:
            {
              hr: { h: 20, borderTop: '1px solid gray' }, //linea horizontal via $LINE[]
            }

          },

        },


      },//fin menu

    },//fin silver

  },
  // fin SKIN


  //=========================================================
  //  |ESCENARIO  // ejecucion via ENTERFRAME
  //==========================================================

  ESCENARIO:
  {

    _frame: //plantilla general
    {
      singleload() { }, //loadframe unico; cargado primero que loadframe

      loadframe() { },
      enterframe() { },

      _singleload_state: 0,
      // innerHTML:"",

      al_cambiar:
      {
        _borrar_hijos: 1,
        _borrar_evar: 1,
      },
    },

    //                                               frames:[{main},  {0},{1},{2}...  ] 
    crear_escenario(f_donde, f_odiv_cliente, f_this, f_frames, f_ini_id) //activado via enterframe general
    {

      if (f_frames.length == 1) //workaround solo mainframe
      {
        f_frames.push({})
      }

      let _frames_horneados = [];

      for (var i = 0; i < f_frames.length; i++) {
        let _u = f_frames[i];
        let _framecopy = clone_object(this._frame);

        setloop_prop(_framecopy, _u);
        _frames_horneados[i] = _framecopy;
      }

      let _frame_main = _frames_horneados[0];
      let _frames = _frames_horneados.slice(1);




      let _foo = {
        $: {}, //def al final

        padre: f_donde,
        cliente: f_odiv_cliente,
        _this: f_this,

        iniciado: 0,

        data: f_frames,

        frame_main: _frame_main,
        frames: _frames,

        current: 0,
        _loadframe_state: 0,


        enterframe()//e -> ref this // [llamado desde crear_enterframe]
        {


          let _mainframe = this.frame_main;

          let _currentframe = this.frames[this.current];

          if (this.iniciado == 1) {

            if (this._loadframe_state == 0) {


              //singleload
              if (_mainframe._singleload_state == 0) {
                bindear(_mainframe.singleload, this._this);
                _mainframe._singleload_state = 1;
              }

              if (_currentframe._singleload_state == 0) {
                bindear(_currentframe.singleload, this._this);
                _currentframe._singleload_state = 1;
              }
              //end singleload

              bindear(_mainframe.loadframe, this._this);
              bindear(_currentframe.loadframe, this._this);


              this._loadframe_state = 1;

            }
            else {
              bindear(_mainframe.enterframe, this._this);
              bindear(_currentframe.enterframe, this._this);


              //enterframe_recursivo(this.padre);   //!! VERIFICAR EN CASO DE ERROR


            }
          }

        },

        cambiar(f_id) {


          let _currentframe = this.frames[this.current];
          //borrar variables locales
          if (_currentframe.al_cambiar._borrar_evar == 1) {
            this.$.EL = {};
          }

          if (_currentframe.al_cambiar._borrar_hijos == 1) {

            let _hijos_clip = this.cliente.hijos_clip;

            if (this.cliente._root !== undefined) {
              _hijos_clip = this.cliente._root.hijos_clip
            }

            let _hijos = [...this.cliente.hijos, ..._hijos_clip];


            for (var _u of _hijos) {

              let _borrar = 1;

              for (var _uu of this.$.EG.no_borrar) {
                if (_u == _uu)
                  _borrar = 0;

              }
              if (_borrar == 1) {
                _u.remove();

              }

            }





          }


          //this.cliente.obj.innerHTML="";

          n_set([this, "current"], f_id, this.frames.length - 1);

          this._loadframe_state = 0;
        },

        iniciar(f_id) {

          this.iniciado = 1;
          this._loadframe_state = 0;
          this.cambiar(f_id);
        },


        pausar_reanudar() {
          if (this.iniciado == 0) {
            this.iniciado = 1;
          }
          else {
            this.iniciado = 0;
          }
        },
        pausar() {
          this.iniciado = 0;
        },
        reanudar() {
          this.iniciado = 1;
        }


      };

      _foo.$ = {
        e_padre: f_donde,
        E: _foo,
        escenario: _foo,
        EL: {}, //variables locales
        EG: {
          no_borrar: [],
        },
      };


      f_donde.escenario = _foo;
      f_donde.modulos_enterframe.push(_foo);


      if (f_ini_id != undefined) {
        _foo.iniciar(f_ini_id);
      }

    }


  },




  //==============================================================
  //   |ENTERFRAME 
  //==============================================================

  //|enterload
  //funcion encarga de ejecutar 'enterframe' o 'load' en objetos 
  enterload(f_donde, f_this = f_donde) {

    let _clip = f_donde;


    //|$
    _root.set_$(_clip);
    window['$enterload'] = _clip;



    if (_clip.is_clip == 1 && _clip.active == 1) {
      if (_clip.padre._is == "clip")//MOVER HIJOS; si esta dentro de clip; sumar sus cordenadas
      {

        if (_clip.padre.padre._is == "clip") //si padre esta dentro de clip; imponer sus cordenadas heredadas
        {
          _clip.px = _clip.padre.px + _clip.padre.x;
          _clip.py = _clip.padre.py + _clip.padre.y;
        }
        else   //si padre no hereda (no esta dentro de clip)
        {
          _clip.px = _clip.padre.x;
          _clip.py = _clip.padre.y;
        }

      }
      _clip._draw(); //metacall
    }


    if (_clip.loadframe_state != 1 && _clip.loadframe != undefined) //ejecutar loadframe si no se ha iniciado
    {
      bindear_(_clip.loadframe, f_this)();
      _clip.loadframe_state = 1;
    }

    if (_clip.enterframe != undefined) {
      if (_clip.locked == undefined || _clip.locked != undefined && _clip.locked.locked !== 1) {

        bindear_(_clip.enterframe, f_this)();
      }
    }



    if (_clip.modulos_enterframe != undefined && _clip.modulos_enterframe.length > 0) {
      for (var _u of _clip.modulos_enterframe)
        enterload(_u);

    }




  },


  //|enterframe_recursivo
  enterframe_recursivo(f_donde) {

    if (f_donde.hijos_clip == undefined)
      f_donde.hijos_clip = [];



    let _delclips = [];
    let _u;

    for (var i = 0; i < f_donde.hijos.length + f_donde.hijos_clip.length; i++) {

      if (i < f_donde.hijos.length)
        _u = f_donde.hijos[i];

      else
        _u = f_donde.hijos_clip[i - f_donde.hijos.length];


      if(_u.enabled_enterload!==0)
      enterload(_u);

      if (_u.propagar_enterframe && (_u.is_clip !== 1 || _u.is_clip == 1 && _u.active == 1) && _u.hijos !== undefined && _u.hijos_clip !== undefined) // |! cambio [08-13-2022] _clip.propagar_enterframe != 0
        enterframe_recursivo(_u);


      //control eliminacion [provisional]
      if (_u.is_clip && _u._DEL) {
        f_donde.hijos_clip.splice(i, 1);
        i--;
      }
     
    }

  },




  //               (odiv)   (referencia 'this')  (funcion enviada)
  //                         se comparte con
  //                           escenario
  // |enterframe
  crear_enterframe(f_donde, f_this_referencia, f_enterframe, f_propagar = 1, f_framerate=60) {

  
    
    f_donde.propagar_enterframe = f_propagar;
    f_donde.enabled_enterload = 1;

    //if (f_donde.escenario != undefined)
    //  f_donde.propagar_enterframe = 0;


    let BIND = f_enterframe.bind(f_this_referencia);
    f_donde.enterframe_desbind = f_enterframe;

    //si [f_this_referencia] es ""; -> referencia 'window'
    if (f_this_referencia == "") 
      BIND = f_enterframe;
    

    f_donde.enterframe = BIND;



    f_donde.framecon = 
    {
      fps:  f_framerate,
      prev: 0,
    }
    


    f_donde._enterframe = function (_time) {

        let _framecon = f_donde.framecon;

        if (f_donde.KILL_ENTERFRAME !== 1) { 
        
        window.requestAnimationFrame(f_donde._enterframe);
        

        //let _now = Math.round(_framecon.fps*Date.now()/1000 );
        //console.log(Date.now()/1000)
        let _now = Math.round(_framecon.fps*_time/1000 );

        if(_now == _framecon.prev) {
               
                return
              };
        _framecon.prev = _now;

        
    
      }


        if(f_donde.enabled_enterload)
        enterload(f_donde);

      if (f_donde.propagar_enterframe == 1) 
          enterframe_recursivo(f_donde);
        


      

      f_donde.KILL_ENTERFRAME = 0;

    }


    //inicializador enterframe
//    window.setTimeout(f_donde._enterframe,1000/f_donde.framecon.framerate);
    return (window.requestAnimationFrame(f_donde._enterframe));


  },


  //=======================================================
  // |TECLADO
  //=======================================================

  TECLADO:
  {
    crear_teclado(f_donde) {
      let _teclado =
      {
        padre: f_donde,
        setloop_direct: 1, //evitar iteracion infinita en setloop()
        keys: [],
        get_arr() {

        },

        get(f_key, f_put) {


          let _r = 0;
          let _set = "";

          let _type = get_type(f_key);

          if (_type == 'array') //
          {
            let _allpressed = 1;
            let _2 = 0;

            for (var i in f_key) {

              if (this.get(f_key[i], f_put) === 0) {
                _allpressed = 0;
                break;
              }
              if (this.get(f_key[i], f_put) === 2) {
                _2++;
                if (_2 == f_key.length) {
                  _allpressed = 0;
                  break;

                }
                // _allpressed=0;
                // break;
              }

            }


            return (_allpressed);
          }


          if (_type == 'string') {
            _r = this.keys[this.ref[f_key]];

            if (_r != 0 && f_put != undefined) {

              this.keys[this.ref[f_key]] = f_put;
            }
          }

          else {
            _r = this.keys[f_key];

            if (_r != 0 && f_put != undefined) {
              this.keys[f_key] = f_put;
            }

          }



          return (_r);
        },

        set(f_key, f_new, lauch_onkeydown = 0, lauch_onkeyup = 0) {

          let _type = get_type(f_key);

          if (_type == 'array') {
            for (var u of f_key)
              this.set(u, f_new, lauch_onkeydown);

          }


          if (_type == 'string')
            this.keys[this.ref[f_key]] = f_new;

          else
            this.keys[f_key] = f_new;



          if (lauch_onkeydown == 1) {

            if (get_type(this.onkeydown) == 'array') {
              for (var _u of this.onkeydown)
                _u({ key: f_key });

            }
            else {
              this.onkeydown({ key: f_key });
            }
          }
          if (lauch_onkeyup == 1) {

            if (get_type(this.onkeyup) == 'array') {
              for (var _u of this.onkeyup)
                _u({ key: f_key });

            }
            else {
              this.onkeyup({ key: f_key });
            }
          }

          //this.onkeydown({key:f_key})
        },

        add_keydown(f_func) {
          this.onkeydown = pushconvert_in_arr(this.onkeydown, f_func);

        },

        add_keyup(f_func) {

          this.onkeyup = pushconvert_in_arr(this.onkeyup, f_func);
        },

        onkeydown(e)//custom
        {

        },
        onkeyup(e)//custom
        {

        },

        ref: {
          'izq': 37, 'der': 39, 'arr': 38, 'aba': 40, 'esc': 27, 'enter': 13, 'Enter': 13, 'ctrl': 17, 'lshift': 16, 'Shift': 16, 'alt': 18,
          'space': 32, ' ': 32,


          'q': 81, 'w': 87, 'e': 69, 'r': 82, 't': 84, 'y': 89, 'u': 85, 'i': 73, 'o': 79, 'p': 80,
          'a': 65, 's': 83, 'd': 68, 'f': 70, 'g': 71, 'h': 72, 'j': 74, 'k': 75, 'l': 76, 'ñ': 192,
          'z': 90, 'x': 88, 'c': 67, 'v': 86, 'b': 66, 'n': 78, 'm': 77,


          '|': 220, 'coma': 188, 'punto': 190, 'guion': 189,
          '1': 49, '2': 50, '3': 51, '4': 52, '5': 53, '6': 54, '7': 55, '8': 56, '9': 57, '0': 48,


          'home': 36, 'end': 35, 'delete': 46, 'insert': 45, 'PageUp': 33, 'PageDown': 34,

          ',': 188, '.': 190, '+': 187, '-': 189, 'borrar': 8,
        },
      }


      if (IS_MOBILE == 0) //solucion bug raro [viewport mobile]
      {
        f_donde.obj.tabIndex = "-1";
        f_donde.obj.style.outline = "none";
        f_donde.obj.focus();
      }

      _teclado.keys = new Array(300);
      for (var i = 0; i < _teclado.keys.length; i++) { _teclado.keys[i] = 0; }

      f_donde.obj.onkeydown = function (e) {


        let _eprev = (this.odiv.teclado.keys[e.keyCode]);

        if (this.odiv.teclado.keys[e.keyCode] == 0)
          this.odiv.teclado.keys[e.keyCode] = 1;


        if (get_type(this.odiv.teclado.onkeydown) == 'array') {
          for (var _u of this.odiv.teclado.onkeydown)
            _u(e, _eprev);

        }
        else
          this.odiv.teclado.onkeydown(e, _eprev);

      }

      f_donde.obj.onkeyup = function (e) {
        let _eprev = (this.odiv.teclado.keys[e.keyCode]);

        this.odiv.teclado.keys[e.keyCode] = 0;

        if (get_type(this.odiv.teclado.onkeyup) == 'array') {
          for (var _u of this.odiv.teclado.onkeyup)
            _u(e, _eprev);

        }
        else {
          this.odiv.teclado.onkeyup(e, _eprev);
        }

      }

      f_donde.teclado = _teclado;
      return (_teclado);
    },//fin craer teclado




    //|plantillas
    plantillas:
    {

      basico:
      {


        _xl: [50, 0],
        _yl: [50, 0],

        _xr: [50, 0],
        _yr: [50, 0],

        style: {},
        style_cabeza: {},
        style_cuello: {},

        base: {
          x: 0, y: 0, w: [0, 0], h: 100, style: { background: "lightgray", overflow: 'visible', }, ovars: { y_orientacion: 'aba' },
        },

        botones:
        {
          z: { x: [0, '_xl'], y: [1, '_yl'], w: 50, h: 50, altura: 10, press_altura: 5, texto: "Z", key: "z", style_cabeza: {}, style_cuello: {} },
          x: { x: [1, '_xl'], y: [1, '_yl'], w: 50, h: 50, altura: 10, press_altura: 5, texto: "X", key: "x", ovars: {}, style_cabeza: {}, style_cuello: {} },

          der: { x: [0, '_xr'], y: [1, '_yr'], w: 50, h: 50, altura: 10, press_altura: 5, texto: "⇨", key: "der", ovars: { x_orientacion: 'der' }, style_cabeza: {}, style_cuello: {} },
          arr: { x: [1, '_xr'], y: [0, '_yr'], w: 50, h: 50, altura: 10, press_altura: 5, texto: "⇧", key: "arr", ovars: { x_orientacion: 'der' }, style_cabeza: {}, style_cuello: {} },
          aba: { x: [1, '_xr'], y: [1, '_yr'], w: 50, h: 50, altura: 10, press_altura: 5, texto: "⇩", key: "aba", ovars: { x_orientacion: 'der' }, style_cabeza: {}, style_cuello: {} },
          izq: { x: [2, '_xr'], y: [1, '_yr'], w: 50, h: 50, altura: 10, press_altura: 5, texto: "⇦", key: "izq", ovars: { x_orientacion: 'der' }, style_cabeza: {}, style_cuello: {} },


        },

      },//fin basica





      abc:
      {
        _x: [30, 10],
        _y: [30, 10],

        style: {},
        style_cabeza: {},
        style_cuello: {},
        base: {
          x: 0, y: 0, w: [0, 0], h: 130, style: { background: "lightgray" }, ovars: { y_orientacion: 'aba' },
        },




        botones:
        {
          q: { x: [0, '_x'], y: [0, '_y'], w: 30, h: 30, altura: 10, press_altura: 5, texto: "q", key: "q", style_cabeza: {}, style_cuello: {} },
          w: { x: [1, '_x'], y: [0, '_y'], w: 30, h: 30, altura: 10, press_altura: 5, texto: "w", key: "w", style_cabeza: {}, style_cuello: {} },
          e: { x: [2, '_x'], y: [0, '_y'], w: 30, h: 30, altura: 10, press_altura: 5, texto: "e", key: "e", style_cabeza: {}, style_cuello: {} },
          r: { x: [3, '_x'], y: [0, '_y'], w: 30, h: 30, altura: 10, press_altura: 5, texto: "r", key: "r", style_cabeza: {}, style_cuello: {} },
          t: { x: [4, '_x'], y: [0, '_y'], w: 30, h: 30, altura: 10, press_altura: 5, texto: "t", key: "t", style_cabeza: {}, style_cuello: {} },
          y: { x: [5, '_x'], y: [0, '_y'], w: 30, h: 30, altura: 10, press_altura: 5, texto: "y", key: "y", style_cabeza: {}, style_cuello: {} },
          u: { x: [6, '_x'], y: [0, '_y'], w: 30, h: 30, altura: 10, press_altura: 5, texto: "u", key: "u", style_cabeza: {}, style_cuello: {} },
          i: { x: [7, '_x'], y: [0, '_y'], w: 30, h: 30, altura: 10, press_altura: 5, texto: "i", key: "i", style_cabeza: {}, style_cuello: {} },
          o: { x: [8, '_x'], y: [0, '_y'], w: 30, h: 30, altura: 10, press_altura: 5, texto: "o", key: "o", style_cabeza: {}, style_cuello: {} },
          p: { x: [9, '_x'], y: [0, '_y'], w: 30, h: 30, altura: 10, press_altura: 5, texto: "p", key: "p", style_cabeza: {}, style_cuello: {} },

          a: { x: [0, '_x'], y: [1, '_y'], w: 30, h: 30, altura: 10, press_altura: 5, texto: "a", key: "a", style_cabeza: {}, style_cuello: {} },
          s: { x: [1, '_x'], y: [1, '_y'], w: 30, h: 30, altura: 10, press_altura: 5, texto: "s", key: "s", style_cabeza: {}, style_cuello: {} },
          d: { x: [2, '_x'], y: [1, '_y'], w: 30, h: 30, altura: 10, press_altura: 5, texto: "d", key: "d", style_cabeza: {}, style_cuello: {} },
          f: { x: [3, '_x'], y: [1, '_y'], w: 30, h: 30, altura: 10, press_altura: 5, texto: "f", key: "f", style_cabeza: {}, style_cuello: {} },
          g: { x: [4, '_x'], y: [1, '_y'], w: 30, h: 30, altura: 10, press_altura: 5, texto: "g", key: "g", style_cabeza: {}, style_cuello: {} },
          h: { x: [5, '_x'], y: [1, '_y'], w: 30, h: 30, altura: 10, press_altura: 5, texto: "h", key: "h", style_cabeza: {}, style_cuello: {} },
          j: { x: [6, '_x'], y: [1, '_y'], w: 30, h: 30, altura: 10, press_altura: 5, texto: "j", key: "j", style_cabeza: {}, style_cuello: {} },
          k: { x: [7, '_x'], y: [1, '_y'], w: 30, h: 30, altura: 10, press_altura: 5, texto: "k", key: "k", style_cabeza: {}, style_cuello: {} },
          l: { x: [8, '_x'], y: [1, '_y'], w: 30, h: 30, altura: 10, press_altura: 5, texto: "l", key: "l", style_cabeza: {}, style_cuello: {} },
          n: { x: [9, '_x'], y: [1, '_y'], w: 30, h: 30, altura: 10, press_altura: 5, texto: "ñ", key: "ñ", style_cabeza: {}, style_cuello: {} }, //!!!!!!!FIX PARCIAL

          z: { x: [0, '_x'], y: [2, '_y'], w: 30, h: 30, altura: 10, press_altura: 5, texto: "z", key: "z", style_cabeza: {}, style_cuello: {} },
          x: { x: [1, '_x'], y: [2, '_y'], w: 30, h: 30, altura: 10, press_altura: 5, texto: "x", key: "x", style_cabeza: {}, style_cuello: {} },
          c: { x: [2, '_x'], y: [2, '_y'], w: 30, h: 30, altura: 10, press_altura: 5, texto: "c", key: "c", style_cabeza: {}, style_cuello: {} },
          v: { x: [3, '_x'], y: [2, '_y'], w: 30, h: 30, altura: 10, press_altura: 5, texto: "v", key: "v", style_cabeza: {}, style_cuello: {} },
          b: { x: [4, '_x'], y: [2, '_y'], w: 30, h: 30, altura: 10, press_altura: 5, texto: "b", key: "b", style_cabeza: {}, style_cuello: {} },
          n: { x: [5, '_x'], y: [2, '_y'], w: 30, h: 30, altura: 10, press_altura: 5, texto: "n", key: "n", style_cabeza: {}, style_cuello: {} },
          m: { x: [6, '_x'], y: [2, '_y'], w: 30, h: 30, altura: 10, press_altura: 5, texto: "m", key: "m", style_cabeza: {}, style_cuello: {} },

          del: { x: [8, '_x'], y: [2, '_y'], w: 30 * 2, h: 30, altura: 10, press_altura: 5, texto: "Del", key: "Backspace", style_cabeza: {}, style_cuello: {} },


          space: { x: [0, '_x'], y: [3, '_y'], w: 30 * 8, h: 30, altura: 10, press_altura: 5, texto: "Space", key: " ", style_cabeza: {}, style_cuello: {} },
          enter: { x: [8, '_x'], y: [3, '_y'], w: 30 * 2, h: 30, altura: 10, press_altura: 5, texto: "Enter", key: "Enter", style_cabeza: {}, style_cuello: {} },




        },

      },//fin basica



    },//fin plantillas


    //TECLADO
    crear_teclado_visual(f_donde, f_modulo, f_plantilla = 'basico', f_data) {


      let _data = setloop_prop(clone_object(TECLADO.plantillas[f_plantilla]),
        f_data);


      if (_data.y_orientacion !== undefined) {
        _data.base.ovars.y_orientacion = _data.y_orientacion;
      }

      let _dbase = _data.base;
      let _dbotones = _data.botones;


      let _base = crear_odiv(f_donde, _dbase.x, _dbase.y, _dbase.w, _dbase.h, _dbase.style, _dbase.ovars);


      _base.botones = {};
      let _botones = _base.botones;





      for (var i in _dbotones) {
        let _u = _dbotones[i];


        //shorcuts aplicacion valores botoes
        if (get_type(_u.x) == 'array')// posicion via multiplicacion
        {
          let _plan = _data[_u.x[1]];
          if (get_type(_plan) == 'number') {
            _plan = [_plan, 0];
          }

          _u.x = _u.x[0] * _plan[0] + _plan[1];

        }
        if (get_type(_u.y) == 'array')//
        {
          let _plan = _data[_u.y[1]];
          if (get_type(_plan) == 'number') {
            _plan = [_plan, 0];
          }

          _u.y = _u.y[0] * _plan[0] + _plan[1];


        }
        //


        _botones[i] = TECLADO.crear_boton(_base, {
          texto: _u.texto,
          x: _u.x,
          y: _u.y,
          w: _u.w,
          h: _u.h,
          altura: _u.altura,
          press_altura: _u.press_altura,

          modulo: f_modulo,
          key: _u.key,
          style: { ..._data.style, ..._u.style },
          style_cabeza: { ..._data.style_cabeza, ..._u.style_cabeza },
          style_cuello: { ..._data.style_cuello, ..._u.style_cuello },
          ovars: _u.ovars,
        });
      }


      return (_base);

    },//fin crear_teclado




    crear_boton(f_donde, f_data) {



      let _data = setloop_prop(
        {
          modulo: "",
          key: "",

          texto: "A",
          altura: 10,
          press_altura: 5,

          x: 0,
          y: 0,
          w: 20,
          h: 20,

          style: { overflow: "visible" },
          style_cabeza: { textAlign: 'center' },
          style_cuello: {},

          ovars: {},
        },
        f_data
      );






      let _boton = crear_odiv(f_donde, _data.x, _data.y, _data.w, _data.h, _data.style, _data.ovars);
      _boton.cabeza = crear_odiv(_boton, 0, -_data.altura, _data.w, _data.h, _data.style_cabeza, { modo_borde: 'sobrepuesto' });
      _boton.cuello = crear_odiv(_boton, 0, 0, 1, 1, _data.style_cuello, { modo_borde: 'sobrepuesto' });

      _boton.data = _data;


      let _cabeza = _boton.cabeza;
      _cabeza.padre_boton = _boton;

      _cabeza.obj.innerHTML = _data.texto;



      _boton.update_cuello = function (f_id) {
        let _data = _boton.data;

        if (f_id == 0)
          _boton.cuello.set(0, -_data.altura + _data.h, _data.w, _data.altura);

        if (f_id == 1)
          _boton.cuello.set(0, -_data.press_altura + _data.h, _data.w, _data.press_altura);


      }


      _boton.update_cuello(0);



      _boton.obj.addEventListener(mousedown_touchstart, function (e) {
        _boton.cabeza.set_y(-_boton.data.press_altura);
        _boton.update_cuello(1);

        let _modulo = _boton.data.modulo;
        let _key = _boton.data.key;
        if (_modulo !== "")
          _modulo.set(_key, 1, 1);

      });



      _boton.obj.addEventListener(mouseup_touchend, function (e) {

        let _modulo = _boton.data.modulo;
        let _key = _boton.data.key;
        if (_modulo !== "")
          _modulo.set(_key, 0, 0, 1);

      });


      sel_normal_mobile(window, _boton.obj).addEventListener(mouseup_touchend, function (e) {
        _boton.cabeza.set_y(-_boton.data.altura);
        _boton.update_cuello(0);

        let _modulo = _boton.data.modulo;
        let _key = _boton.data.key;
        if (_modulo !== "") {
          _modulo.set(_key, 0);
          //_modulo.onkeyup({key:_key})  
        }


      });


    },//fin crear_boton








  },

  //======================================================
  // |AUDIO
  //======================================================
  AUDIO:
  {
    ctx: '',
    mastergain: '',
    limitador: '',  //limitador -> mastergain -> ctx

    ini() //se ejecuta al finalizar este script
    {
      this.ctx = new AudioContext;
      this.mastergain = this.ctx.createGain();
      this.limitador = this.crear_limitador(this.ctx);
      this.mastergain.gain.setValueAtTime(-0.4, this.ctx.currentTime);


      this.limitador.connect(this.mastergain);
      this.mastergain.connect(this.ctx.destination);

    },

    load_sample(f_url, f_callback) {

      let _ctx = this.ctx;
      // let _buffer = _ctx.createBufferSource();

      let _request = new XMLHttpRequest();
      _request.open('GET', f_url, true);
      _request.responseType = 'arraybuffer';

      _request.onload = function () {
        _ctx.decodeAudioData(_request.response, function (buffer_decoded) {

          f_callback(buffer_decoded, _request);
        }
        )

      }

      _request.send();
      return (_request);
    },

    //ref https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createBuffer
    play_raw(f_data) {

      let _data = setloop_prop(
        {
          time:undefined,
          offset:[0,undefined],

          pitch: 1,
          pitch_x: 100,
          loop:0,
          raw:[0],
        },
        f_data
      )
      if(get_type(f_data.offset) == 'number' )
         f_data.offset=[f_data.offset, undefined];

      

                            //sample rate = 48000 = length
                            // audio needs to be in [-1.0; 1.0]
                                                           //1=sec
      //let _raw = this.ctx.createBuffer(1, this.ctx.sampleRate*1, this.ctx.sampleRate);

      let _raw = this.ctx.createBuffer(1, _data.raw.length, this.ctx.sampleRate);

      let _channel = _raw.getChannelData(0);

        _channel.set(_data.raw);
     //for(var i =0;i<_data.raw.length;i++)
     //{
     //   _channel[i]=_data.raw[i];
     //}

      let _buffer = this.ctx.createBufferSource();
      _buffer.buffer = _raw;

  _buffer.connect(this.ctx.destination);

/*
      let _gain = this.ctx.createGain();

      _gain.gain.value = 0;
      _gain.gain.setValueCurveAtTime([0, 1], this.ctx.currentTime, 0.1);

      
      _buffer.connect(_gain);
      _buffer.gain = _gain;

      //12-29-2023
      //_gain.connect(this.mastergain);


//      _buffer.detune.value = _data.pitch * _data.pitch_x;
      _buffer.loop = _data.loop;
*/

     //_buffer.connect(this.limitador);

      _buffer.start(_data.time,  _data.offset[0],_data.offset[1]);


      // this.limitador.connect(_gain);


      // this.limitador.connect(_gain);








      return (_buffer)
    },

    play_sample(f_buffer, f_gain=1, f_pitch = 0, f_loop = 0, f_time=undefined,f_offset=[0,undefined],) {
      let _ctx = this.ctx;






      let _buffer = _ctx.createBufferSource();

      //   _buffer.buffer =    new Float32Array([10,10,10,10]);
      _buffer.buffer = f_buffer;

      //alert(_buffer.detune.value)
      _buffer.detune.value = f_pitch * 100;



      // _buffer.playbackRate.value = f_pitch;
      //  _buffer.onended=function(){console.log("a")}


      let _gain = this.ctx.createGain();
      _gain.gain.value = 0;
      _gain.gain.setValueCurveAtTime([0, f_gain], this.ctx.currentTime, 0.1);

      _buffer.connect(_gain);
      _buffer.gain = _gain;

      //_gain.connect(this.mastergain);




//      _buffer.connect(this.limitador);

      _gain.connect(this.limitador);
      _buffer.loop = f_loop;





      //_buffer.loopStart=1;
      //_buffer.loopEnd=1.1;

      //_buffer.start();
      _buffer.start(f_time,  f_offset[0],f_offset[1]);
      _buffer.startTime = AUDIO.ctx.currentTime;

    return(_buffer);


    },

    crear_limitador(_ctx = this.ctx) {
      let _limitador = _ctx.createDynamicsCompressor();
      // Creating a compressor but setting a high threshold and 
      // high ratio so it acts as a limiter. More explanation at 
      // https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode
      _limitador.threshold.setValueAtTime(-5.0, _ctx.currentTime); // In Decibels
      _limitador.knee.setValueAtTime(0, _ctx.currentTime); // In Decibels
      _limitador.ratio.setValueAtTime(40.0, _ctx.currentTime);  // In Decibels
      _limitador.attack.setValueAtTime(0.001, _ctx.currentTime); // Time is seconds
      _limitador.release.setValueAtTime(0.1, _ctx.currentTime); // Time is seconds

      return (_limitador)
    },


   //misc
   // Returns Uint8Array of WAV bytes
  getWavBytes(buffer, options) {
  const type = options.isFloat ? Float32Array : Uint16Array
  const numFrames = buffer.byteLength / type.BYTES_PER_ELEMENT

  const headerBytes = AUDIO.getWavHeader(Object.assign({}, options, { numFrames }))
  const wavBytes = new Uint8Array(headerBytes.length + buffer.byteLength);

  // prepend header, then add pcmBytes
  wavBytes.set(headerBytes, 0)
  wavBytes.set(new Uint8Array(buffer), headerBytes.length)

  return wavBytes
},

// adapted from https://gist.github.com/also/900023
// returns Uint8Array of WAV header bytes
getWavHeader(options) {
  const numFrames =      options.numFrames
  const numChannels =    options.numChannels || 2
  const sampleRate =     options.sampleRate || 44100
  const bytesPerSample = options.isFloat? 4 : 2
  const format =         options.isFloat? 3 : 1

  const blockAlign = numChannels * bytesPerSample
  const byteRate = sampleRate * blockAlign
  const dataSize = numFrames * blockAlign

  const buffer = new ArrayBuffer(44)
  const dv = new DataView(buffer)

  let p = 0

  function writeString(s) {
    for (let i = 0; i < s.length; i++) {
      dv.setUint8(p + i, s.charCodeAt(i))
    }
    p += s.length
  }

  function writeUint32(d) {
    dv.setUint32(p, d, true)
    p += 4
  }

  function writeUint16(d) {
    dv.setUint16(p, d, true)
    p += 2
  }

  writeString('RIFF')              // ChunkID
  writeUint32(dataSize + 36)       // ChunkSize
  writeString('WAVE')              // Format
  writeString('fmt ')              // Subchunk1ID
  writeUint32(16)                  // Subchunk1Size
  writeUint16(format)              // AudioFormat https://i.stack.imgur.com/BuSmb.png
  writeUint16(numChannels)         // NumChannels
  writeUint32(sampleRate)          // SampleRate
  writeUint32(byteRate)            // ByteRate
  writeUint16(blockAlign)          // BlockAlign
  writeUint16(bytesPerSample * 8)  // BitsPerSample
  writeString('data')              // Subchunk2ID
  writeUint32(dataSize)            // Subchunk2Size

  return new Uint8Array(buffer)
}



  },



  //======================================================
  //                     |CURSOR
  //======================================================

  CURSOR:
  {

    //|grab 
    //                                  {onmousedown(){}..., onmousemove(){}....}
    crear_grab(f_quien, f_detonante, f_data) {

      //to do: pulir implementacion '_total'
      let _total = 0; //activado ante click en cualquier hijo

      f_quien.grab = {

        detonante: f_detonante,
        bubbling: 0,
        onmousedown() { },
        onmousemove() { },
        onmouseup() { },

        active: 1,
        estado: 0,
        xy_lock: [0, 0],

        prev: { x: 0, y: 0 },
        ini: { x: 0, y: 0 }, //en realidad es posicion de objeto final ajena a su posterior transformacion
      };

      setloop_prop(f_quien.grab, f_data);


      if (f_detonante == undefined || f_detonante == 'total') {
        if (f_detonante == 'total')
          _total = 1;

        f_detonante = f_quien;

      }

      f_html = window;


      function _grab_mousedown_func(e) {
        e = mb(e);

        f_quien.grab.estado = 1;


        f_quien.grab.prev.x = e.x;
        f_quien.grab.prev.y = e.y;


        f_quien.grab.ini.x = f_quien.xr;
        f_quien.grab.ini.y = f_quien.yr;


        //para restaurar en mouseup
        let _orientaciones = [f_quien.x_orientacion, f_quien.y_orientacion];


        function _grab_mousemove_func(e) {

          e = mb(e);

          if (f_quien.grab.active == 1) {

            //cambiar a modo izquierda arriba por motivos de comodidad
            f_quien.x_orientacion = "izq";
            f_quien.y_orientacion = "arr";


            if (f_quien.grab.xy_lock[0] == 0) {

              f_quien.set_x(f_quien.grab.ini.x + (e.x - f_quien.grab.prev.x));
              f_quien.grab.ini.x += (e.x - f_quien.grab.prev.x);

            }


            if (f_quien.grab.xy_lock[1] == 0) {
              f_quien.set_y(f_quien.grab.ini.y + (e.y - f_quien.grab.prev.y));
              f_quien.grab.ini.y += (e.y - f_quien.grab.prev.y);

            }

          }


          f_quien.grab.prev.x = e.x;
          f_quien.grab.prev.y = e.y;

          bindear_(f_quien.grab.onmousemove, f_quien)(e);

        }


        function _grab_mouseup_func(e) {

          e = mb(e);

          bindear_(f_quien.grab.onmouseup, f_quien)(e);


          f_quien.grab.estado = 0;

          f_html.removeEventListener(mousemove_touchmove, _grab_mousemove_func);
          f_html.removeEventListener(mouseup_touchend, _grab_mouseup_func);


          f_quien.x_orientacion = _orientaciones[0];
          f_quien.y_orientacion = _orientaciones[1];


          if (f_quien.x_orientacion == 'der')
            f_quien.x = (f_quien.padre.w - f_quien.xr - f_quien.w - f_quien.padre.get_borde(0) - f_quien.padre.get_borde(2));


          if (f_quien.y_orientacion == 'aba')
            f_quien.y = (f_quien.padre.h - f_quien.yr - f_quien.h - f_quien.padre.get_borde(1) - f_quien.padre.get_borde(3));


          f_quien.update();
        }


        //odiv_img fix
        // if(_total== 1 || e.target == f_detonante.obj || e.target==f_detonante.obj_img)
        if (f_quien.grab.detonante == 'total' || e.target == f_detonante.obj || e.target == f_detonante.obj_img) {
          f_html.addEventListener(mousemove_touchmove, _grab_mousemove_func);
          f_html.addEventListener(mouseup_touchend, _grab_mouseup_func);
        }


        bindear_(f_quien.grab.onmousedown, f_quien)(e);

      }//grab mousedown


      f_detonante.obj.addEventListener(mousedown_touchstart, _grab_mousedown_func, f_quien.grab.bubbling);

    },


    crear_deltadrag(f_donde, f_data = {}) {

      f_donde.deltadrag =
      {
        ...{
          _padre: f_donde,
          estado: 0,
          prev: [0, 0], //x,y

          pointerout: 1, //cancelar [mouseup] al pointerout
          update(_dx, _dy) {

          },

          mousedown(e) {
            this.estado = 1;
            this.prev = [e.layerX, e.layerY];
          },
          mouseup() {
            this.estado = 0;
            this.prev = [0, 0];
          },
          mousemove(e) {
            if (this.estado) {
              this.update(e.layerX - this.prev[0], e.layerY - this.prev[1]);
              this.prev = [e.layerX, e.layerY];
            }

          }
        },

        ...f_data

      }

      let _delta = f_donde.deltadrag;

      f_donde.obj.addEventListener('pointerdown', bindear_(_delta.mousedown, _delta));

      f_donde.obj.addEventListener('pointerup', bindear_(_delta.mouseup, _delta));
      f_donde.obj.addEventListener('pointercancel', bindear_(_delta.mouseup, _delta));

      if (_delta.pointerout)
        f_donde.obj.addEventListener('pointerout', bindear_(_delta.mouseup, _delta));

      f_donde.obj.addEventListener('pointerleave', bindear_(_delta.mouseup, _delta));



      f_donde.obj.addEventListener('pointermove', bindear_(_delta.mousemove, _delta));


    },




    crear_gesture_cC(f_donde, f_func = () => { }) {

      let _data =
      {

        ...{

          func(_delta) {

          },

          points: [],
          prevdis: -1,

          onpointerdown(e) {
            let _points = this.points;
            if (_points.length < 2)
              _points.push(e);

            //console.log(e.pointerId)


          },
          onpointermove(e) {
            let _points = this.points;

            for (var i = 0; i < _points.length; i++) {
              if (_points[i].pointerId == e.pointerId) {
                _points[i] = e;
              }
            }


            if (_points.length == 2) {


              let _dis = get_distance(_points[0].clientX, _points[0].clientY,
                _points[1].clientX, _points[1].clientY);

              //console.log(_dis)
              if (this.prevdis === -1)
                this.prevdis = _dis;


              this.func(Math.floor(_dis - this.prevdis));


              this.prevdis = _dis;

            }

            else {
              this.prevdis = -1;
            }


          },

          onpointerup(e) {
            let _points = this.points;
            for (var i = 0; i < _points.length; i++) {
              if (_points[i].pointerId == e.pointerId)
                _points.splice(i, 1);
            }

            if (_points.length !== 2)
              this.prevdis = -1;

            //console.log(e.pointerId)
            //console.log(_points.length)

          },

        },

        ...{
          func: f_func
        }

      }


      f_donde.onpointerdown = bindear_(_data.onpointerdown, _data);
      f_donde.onpointermove = bindear_(_data.onpointermove, _data);

      f_donde.onpointerup = bindear_(_data.onpointerup, _data);
      f_donde.onpointercancel = bindear_(_data.onpointerup, _data);
      f_donde.onpointerout = bindear_(_data.onpointerup, _data);
      f_donde.onpointerleave = bindear_(_data.onpointerup, _data);


      return (_data);

    },



    //=======
    //|resize //2.0
    //=======

    crear_resize(f_odiv, f_data = {}) {

      //atajo f_data{borde: ? }
      let _btype = get_type(f_data.borde)
      if (_btype == 'number') {
        f_data.click_margen = [f_data.borde, f_data.borde, f_data.borde, f_data.borde];
        f_data.padding_margen = [f_data.borde, f_data.borde, f_data.borde, f_data.borde];
      }
      if (_btype == 'array') {
        f_data.click_margen = clone_array(f_data.borde);
        f_data.padding_margen = clone_array(f_data.borde);
      }



      f_odiv.resize = setloop_prop(
        {
          click_margen: [10, 10, 10, 10], //area activa
          padding_margen: [10, 10, 10, 10], //limites espacio en blanco; sumar 1 por lado en caso de ventana con _bloque


          estado: [0, 0, 0, 0], // 1 = en grab

          ini: [0, 0, 0, 0, 0, 0], //   global coordenadas x y x+w y+h, local w,h; definidas  al iniciar resize (onmousedown)
          plus: [0, 0],
          lock: [0, 0, 0, 0],
          //en todo evento, this = odiv
          onmousedown(e) {
            mb(e);

            if (e.target == this.obj) {
              let _global = this.get_global();
              let _click_margen = this.resize.click_margen;
              let _x = e.x - (_global.x - 1);
              let _y = e.y - (_global.y - 1);
              let _w = this.wr;
              let _h = this.hr;
              let _lock = this.resize.lock;

              let _borde = this.get_borde('all');

              this.resize.ini = [_global.x - 1, _global.y - 1, _global.x - 1 + _w, _global.y - 1 + _h, _w, _h];

              if (_x < _click_margen[0] + _borde[0] && _lock[0] == 0) {
                this.resize.estado[0] = 1;
                this.resize.plus[0] = _x;
              }

              else if (_x > _w - _click_margen[2] - _borde[2] && _lock[2] == 0) {
                this.resize.estado[2] = 1;
                this.resize.plus[0] = _w - _x;

              }

              if (_y < _click_margen[1] + _borde[1] && _lock[1] == 0) {
                this.resize.estado[1] = 1;
                this.resize.plus[1] = _y;

              }


              else if (_y > _h - _click_margen[3] - _borde[3] && _lock[3] == 0) {
                this.resize.estado[3] = 1;
                this.resize.plus[1] = _h - _y;

              }


              if (this.resize.estado.join('') !== '0000') {

                window.addEventListener(mousemove_touchmove, this.resize.onmousemove);
                window.addEventListener(mouseup_touchend, this.resize.onmouseup);

              }
            }

          },

          onmousemove(e) // e = window;global
          {
            mb(e);


            let _resize = this.resize;
            let _click_margen = _resize.click_margen;
            let _estado = _resize.estado;
            let _ini = _resize.ini;
            let _plus = _resize.plus;


            let _borde = this.get_borde('all');

            // _padding: borde + padding;
            let _padding = [_resize.padding_margen[0] + _resize.padding_margen[2] + _borde[0] + _borde[2],
            _resize.padding_margen[0] + _resize.padding_margen[2] + _borde[0] + _borde[2],

            _resize.padding_margen[0] + _resize.padding_margen[2] + _borde[0] + _borde[2],
            _resize.padding_margen[1] + _resize.padding_margen[3] + _borde[1] + _borde[3]];


            if (_estado[0] == 1) {
              let _x = e.x - _plus[0];
              if (_x > _ini[2] - _padding[2])
                _x = _ini[2] - _padding[2];

              this.set_x(_x);
              this.set_w(_ini[4] - ((_x) - _ini[0]))

            }


            if (_estado[1] == 1) {
              let _y = e.y - _plus[1];
              if (_y > _ini[3] - _padding[3])
                _y = _ini[3] - _padding[3];
              this.set_y(_y);
              this.set_h(_ini[5] - ((_y) - _ini[1]))

            }


            if (_estado[2] == 1) {
              let _w = _ini[4] - (_ini[2] - e.x - _plus[0]);

              if (_w < _padding[0])
                _w = _padding[0];

              this.set_w(_w);

            }

            if (_estado[3] == 1) {
              let _h = _ini[5] - (_ini[3] - e.y - _plus[1]);

              if (_h < _padding[1])
                _h = _padding[1];

              this.set_h(_h);

            }



          },


          onmouseup(e) {
            mb(e);

            this.resize.estado.fill(0);
            window.removeEventListener(mousemove_touchmove, this.resize.onmousemove)
            window.removeEventListener(mouseup_touchend, this.resize.onmouseup)

          },




        }
        , f_data
      );

      f_odiv.resize.onmousedown = bindear_(f_odiv.resize.onmousedown, f_odiv);
      f_odiv.resize.onmousemove = bindear_(f_odiv.resize.onmousemove, f_odiv);
      f_odiv.resize.onmouseup = bindear_(f_odiv.resize.onmouseup, f_odiv);



      f_odiv.obj.addEventListener(mousedown_touchstart, f_odiv.resize.onmousedown);


    },






    //             odiv 
    //crear_cursor(f_donde, _autoset)
    crear_cursor(f_donde, f_data) {


      let _data =
      {
        autoset: 1,
        holdclick_out: 1,

      }

      _data = setloop_prop(_data, f_data);


      let _cursor = {
        padre: f_donde,

        //0: Main button pressed, usually the left button or the un-initialized state
        //1: Au xiliary button pressed, usually the wheel button or the middle button (if present)
        //2: Secondary button pressed, usually the right button
        //3: Fourth button, typically the Browser Back button
        //4: Fifth button, typically the Browser Forward button
        estado: [0, 0, 0, 0, 0],
        _out_estado: [0, 0, 0, 0, 0], //holdclick_out==0
        setloop_direct: 1,

        x: 0, xl: 0,   //x = xl = local
        y: 0, yl: 0,


        prev_x: 0, prev_y: 0,
        prev_xl: 0, prev_yl: 0,
        prev_xg: 0, prev_xg: 0,

        xg: 0,
        yg: 0,



        saveprev() //nivelar a enterframe 
        {
          _cursor.prev_x = _cursor.xl;
          _cursor.prev_y = _cursor.yl;

          _cursor.prev_xl = _cursor.xl;
          _cursor.prev_yl = _cursor.yl;

          _cursor.prev_xg = _cursor.xg;
          _cursor.prev_yg = _cursor.yg;


        },

        _mousemove(e) {

          e = mb(e);



          _cursor.xg = e.x;
          _cursor.yg = e.y;


          let _path = e.composedPath();

          for (var i in _path) {
            if (_path[i] == _cursor.padre.obj) {
              let _g = (_path[i].odiv.get_global());

              _cursor.xl = e.x - _g.x + 1;
              _cursor.yl = e.y - _g.y + 1;

              _cursor.x = _cursor.xl;
              _cursor.y = _cursor.yl;
              break;
            }
          }

          /*   if(e.target==_cursor.padre.obj)
             {
           
             _cursor.x = e.layerX+1;
             _cursor.y = e.layerY+1;

             _cursor.xl = e.layerX+1;
             _cursor.yl = e.layerY+1;
             }
           */

          func_from_array(_cursor.mousemove, e); //mousemove puede ser   function   o   array[function,function]

          //                  _cursor.mousemove(e);

        },

        _mousedown(e) {

          if (this.odiv.$) {
            _root.set_$(this.odiv);
            //console.log('moetan mousedown'); 
          }


          e = mb(e);

          //====================agregado 04-17-2023
          _cursor.xg = e.x;
          _cursor.yg = e.y;

          //e.path no es compatible en todos navegadores; usar composedPath()
          let _path = e.composedPath();

          for (var i in _path) {
            if (_path[i] == _cursor.padre.obj) {
              //       alert("wawito_1")
              let _g = (_path[i].odiv.get_global());

              _cursor.xl = e.x - _g.x + 1;
              _cursor.yl = e.y - _g.y + 1;

              _cursor.x = _cursor.xl;
              _cursor.y = _cursor.yl;
              break;
            }
          }
          //====================

          _cursor.estado[e.button] = 1;

          func_from_array(_cursor.mousedown, e); //mousedown puede ser   function   o   array[function,function]

        },

        _mouseup(e) {

          e = mb(e);

          _cursor.estado[e.button] = 0;
          _cursor._out_estado[e.button] = 0;

          //_cursor.mouseup(e);
          func_from_array(_cursor.mouseup, e); //mouseup puede ser   function   o   array[function,function]

        },

        //holdclick_out == 0
        _mouseleave(e) {
          for (var i in _cursor.estado) {
            _cursor._out_estado[i] = _cursor.estado[i];
            _cursor.estado[i] = 0;
          }
        },

        _mouseenter(e) {

          for (var i in _cursor._out_estado) {
            _cursor.estado[i] = _cursor._out_estado[i];
            _cursor._out_estado[i] = 0;
          }

        },

        //holdclick_out == 0



        mousemove(e) { },
        mousedown(e) { },
        mouseup(e) { },

        add_mousedown(f_data) {
          this.mousedown = pushconvert_in_arr(this.mousedown, f_data);
        },

        add_mouseup(f_data) {
          this.mouseup = pushconvert_in_arr(this.mouseup, f_data);
        },

        add_mousemove(f_data) {
          this.mousemove = pushconvert_in_arr(this.mousemove, f_data);
        },

      };


      //window.removeEventListener(mousemove_touchmove, this.resize.onmousemove)
      //window.removeEventListener(mouseup_touchend,    this.resize.onmouseup)
      //mousedown_touchstart
      //window.addEventListener("mousemove", _cursor._mousemove, true);
      f_donde.obj.addEventListener(mousemove_touchmove, _cursor._mousemove, true);

      f_donde.obj.addEventListener(mousedown_touchstart, _cursor._mousedown);
      window.addEventListener(mouseup_touchend, _cursor._mouseup);

      if (_data.holdclick_out == 0) {
        f_donde.obj.addEventListener("mouseleave", _cursor._mouseleave);
        f_donde.obj.addEventListener("mouseenter", _cursor._mouseenter);

      }

      if (_data.autoset == 1) {
        f_donde.cursor = _cursor;
      }

      return (_cursor);

    },//crear cursor



    doubleclick:
    {
      target: '',
      delta: 300,
      stamp: 0,

      check(e) {

        if (this.stamp > 0 && this.target == e.target && e.timeStamp < this.stamp + this.delta) {

          this.stamp = 0;
          this.target = '';
          return (1)

        }

        this.stamp = e.timeStamp;
        this.target = e.target;
        return (0);



      }//check


    },





  },

  //======================================================
  //                    
  //======================================================



  //======================================================
  //                  |GAME  |gameges               
  //======================================================

  GAME: {


    //ayuda a
    //simplificion creacion clips [posibilidad declarar ctx predeterminado, etc...]
    //refrescar canvas al inicio de cada frame
    //             odiv   odiv_canvas     

    //                               {des:odiv ,x,y,... }
    //                                  |
    crear_gestor(f_donde, f_canvas, f_root, f_lib)
    //                                             | 
    //                                           opcional
    {


      //valores de clip_vacio por defecto
      f_root = setloop_prop(
        {
          donde: f_donde, //
          w: 0,
          h: 0,
          x: 0,
          y: 0,
          _rootclip: 1,
        },
        f_root
      );



      //ubicacion de libreria; si no esta definido, se asume LIB en f_donde
      if (esundempty(f_lib))
        f_lib = f_donde.LIB;

      let _canvasses;
      if (get_type(f_canvas) != "array")
        _canvasses = [f_canvas];

      else
        _canvasses = f_canvas;




      var _foo =
      {
        padre: f_donde,
        _root: "def al final",

        LIB: f_lib,
        LIB_IMAGES: f_lib.IMAGES,
        LIB_CLASES: f_lib.CLASES,
        LIB_SOUNDS: f_lib.SOUNDS,


        canvasses: _canvasses,

        canvas: _canvasses[0],
        ctx: _canvasses[0].ctx,

        ctx_borrar_ini: 1,

        $: { GESTOR: 'def al final', CANVASSES: _canvasses, CANVAS: _canvasses[0] },


        //===================================================
        //
        //                 =================
        //             [*] FUNCION PRINCIPAL [*]
        //                 =================
        //
        //====================================================
        _enterframe() { },

        clear_all() {
          
          for (var u of this.canvasses) {
            u.obj.style.background = "transparent";
            if (u.no_clear !== 1)
            {
              u.clear();
              
            }
          }

        },
        enterframe() {

          this.clear_all();
       

          if (this.fondoges.estado == 1 && this.fondoges.id !== "") {
            this.fondoges.run();

            if (get_type(this.fondoges.after_draw) == "function")
              this.fondoges.after_draw();
          }

          if (this.tileges.estado == 1) 
            this.tileges.run();
          

            //pintado final
            for (var i = 0; i < this.canvasses.length; i++) {
              let _u = this.canvasses[i];
              

              for (var j = 0; j < _u.buffers.length; j++) {
                let _j = _u.buffers[j];
                let _cords = _j.drawcords;

                if (_cords)//workaround
                {
                  _u.ctx.drawImage(_j.obj,
                    _cords[0], _cords[1], _cords[2], _cords[3], _cords[4], _cords[5], _cords[6], _cords[7]);
                }
              }
             }
          

          this._enterframe();
        },//fin enterframe



        //===========
        //|fondoges
        //===========
        fondoges:
        {
          estado: 0,
          padre: "def al final",
          fondos: [],

          run() //main function
          {
            if (this.estado == 1) {
              for (var u of this.fondos) {
                   u.run();
              }
            }

          },


          ini(fn_canvas, f_data, f_estado = 1) //buffer o canvas directo
          {

            this.estado = f_estado;

            if (get_type(f_data.image) == 'number') {

              f_data.image = this.padre.LIB_IMAGES[f_data.image];
            }
            let _canvas = this.padre.canvasses[fn_canvas];

            if(_canvas.buffers.length==0)
            {
              let _wr = _canvas.wr;
              let _hr = _canvas.hr;
                _canvas.crear_buffer(_wr, _hr);
                _canvas.buffers[0].drawcords=[0,0,_wr,_hr, 0,0,_wr,_hr];
            }




            let _fondo =
              setloop_prop(
                {

                  padre: this.padre, //this.padre = padre de fondoges

                  image: '',

                  x: 0, y: 0,
                  _x: 0, _y: 0, //alterada por diferencia
                  xprev: 0, yprev: 0,
                  canvas: this.padre.canvasses[fn_canvas],
                  loop:[1,1],


                  run() {

                        for(var j of this.canvas.buffers)
                        {
          //                j.clear();
                        }
                    let _image = this.image;
                    
                    this._x += Math.floor(this.x) - Math.floor(this.xprev);
                    this._y += Math.floor(this.y) - Math.floor(this.yprev);

                    if (_image !== "") {


                      if(this.loop[0])
                      {
                      if (this._x + _image.naturalWidth < 0) 
                          this._x += _image.naturalWidth;
                      
                      if (this._x > 0) 
                        this._x -= _image.naturalWidth;
                     }
                      


                      if(this.loop[1])
                      {
                      if (this._y + _image.naturalHeight < 0) 
                        this._y += _image.naturalHeight;
                      if (this._y > 0) 
                        this._y -= _image.naturalHeight;
                      
                      }

                      this.single_draw(this._x, this._y);
                      //console.log("dada")
                    }

                    this.xprev = this.x;
                    this.yprev = this.y;

                  },//fondo run                


                  single_draw(_x, _y) {


                    let _canvas = this.canvas;
                    

                    let _ctx = _canvas.buffers[0].ctx;
                    let _image = this.image;


                    let _cw = (_canvas.wini / 2);
                    let _ch = (_canvas.hini / 2);

                    let _w = _cw;
                    let _h = _ch;


                    if (this.loop[0]&& _x + _image.naturalWidth < _cw) {

                      this.single_draw(_x + _image.naturalWidth, _y);

                      _w -= (((-_x) + _w) - _image.naturalWidth);

                    }

                    if (this.loop[1]&& _y + _image.naturalHeight < _ch) {
                      this.single_draw(_x, _y + _image.naturalHeight);

                      _h -= (((-_y) + _h) - _image.naturalHeight);
                    }

                    _ctx.drawImage(_image,
                      -_x, -_y, _w, _h,

                      0, 0, _w, _h);


                  }, //singledraw         

                }

                ,

                f_data)//setloop prop


            this.fondos.push(_fondo);

            return (_fondo);

          },//ini

          //general    puntual
          //[0,1] || [[],[],[]... ]
          set(f_arr) {

            if (get_type(f_arr[0]) == 'number') {
              for (var u of this.fondos) {
                u.x = f_arr[0];
                u.y = f_arr[1];
              }
            }
            else {
              for (var i = 0; i < f_arr.length; i++) {
                if (f_arr[i] !== "") {
                  this.fondos[i].x = f_arr[i][0];
                  this.fondos[i].y = f_arr[i][1];
                }
              }

            }

          },

        },//fondo ges

        //========================
        //         |tileges
        //========================

        tileges: {

          estado: 0,
          padre: "def al final",
          setloop_direct: 1,



          //[back, act, fore]
          //   |
          ini_with_buffers(f_can_id, f_data) {

            let _b0 = (this.padre.canvasses[f_can_id[0]].crear_buffer((f_data.xt_max + 1) * f_data.wt, (f_data.yt_max + 1) * f_data.ht));
            let _b1 = (this.padre.canvasses[f_can_id[1]].crear_buffer((f_data.xt_max + 1) * f_data.wt, (f_data.yt_max + 1) * f_data.ht));
            let _b2 = (this.padre.canvasses[f_can_id[2]].crear_buffer((f_data.xt_max + 1) * f_data.wt, (f_data.yt_max + 1) * f_data.ht));

            let _buffers = [_b0, _b1, _b2];


            this.ini(_buffers, f_data);
          },


          //obtener tile apropiado de acuerdo a frame de animacion
          tile_from_tilemap(_tilemap, _i, _j) {
            let _u;

            _u = _tilemap[_i][_j];

            if (this.tiledata.anim[_u] != "" && this.tiledata.anim[_u] != undefined) {
              _u = this.tiledata.anim[_u][this.refresh.tileanim_id];
            }


            return _u;
          },


          // [0inferior;1activo;1superior]
          //       |
          ini(f_canvasses, f_data) {
            let _padre = this.padre;
            this.padre.$.tileges = this;


            this.canvasses = [
              f_canvasses[0], //0: layer inferior
              f_canvasses[1], //1: layer activa
              f_canvasses[2], //2: layer superior
            ];


            this.estado = 1;
            this.images = [];

            if (get_type(f_data.id) == 'number')
              this.images.push(this.padre.LIB_IMAGES[f_data.id]);

            else
              this.images.push(f_data.id);



            this.x = 0; this.xprev = 0; this.xprev_t = 0;
            this.y = 0; this.yprev = 0; this.yprev_t = 0;

            this.wt = 0;//tile x
            this.yt = 0;//tile y
            this.xt_max = 0; //ancho de pantalla en tiles
            this.yt_max = 0; //alto de pantalla en tiles


            let _empty_map_xt = f_data.empty_map_xt;
            if (_empty_map_xt == undefined) {
              if (f_data.tilemap_0 !== undefined)
                _empty_map_xt = f_data.tilemap_0[0].length;
              else
                _empty_map_xt = f_data.xt_max;
            }

            let _empty_map_yt = f_data.empty_map_yt;
            if (_empty_map_yt == undefined) {
              if (f_data.tilemap_0 !== undefined)
                _empty_map_yt = f_data.tilemap_0.length;
              else
                _empty_map_yt = f_data.yt_max;
            }



            this.tilemap_0   = crear_multiarray(_empty_map_yt, _empty_map_xt, 0);
            this.tilemap_1   = crear_multiarray(_empty_map_yt, _empty_map_xt, 0);//clone_array(this.tilemap_0);
            this.tilemap_2   = crear_multiarray(_empty_map_yt, _empty_map_xt, 0); //clone_array(this.tilemap_0);
            this.tilemap_obj = crear_multiarray(_empty_map_yt, _empty_map_xt, 0); //clone_array(this.tilemap_0);


            setloop_prop(this, f_data);


            this.tilemaps = [this.tilemap_0, this.tilemap_1, this.tilemap_2];
            this.tilemaps_all = [this.tilemap_0, this.tilemap_1, this.tilemap_2, this.tilemap_obj];



            //|refresh
            this.refresh = {
              padre: this,
              __x: 0,
              __y: 0,

              run(__x, __y) {

                this.tt++;
                if (this.tt > this.max || this.forced == 1) {

                  if (this.tt > this.max) {
                    this.tt = 0;
                    this.tileanim_id++;
                    if (this.tileanim_id > this.padre.tiledata.anim_max)
                      this.tileanim_id = 0;

                  }


                  for (var i = 0; i < 3; i++) {
                    this.padre.canvasses[i].clear();
                  }

                  this.padre.draw_total(__x, __y, 0, 0);


                  if (this.forced == 1)
                    this.forced = 0;


                }

              },

              force() {
                this.forced = 1;
              },

              forced: 0,
              tt: 29, max: 30,
              tileanim_id: 0,
            };

            this.tiledatas =
            {
              _padre: "",
              tiledatas: [],
              act: "",

              add(f_tiledata = this.default, f_set = 0) {
                let _data = setloop_prop(
                                     clone_object(this.default),
                                     f_tiledata);


                this.tiledatas.push(_data);
                if (f_set) {
                  this.act = _data;
                  this._padre.tiledata = this.act;
                }

              },
              set(f_data) {

                if (get_type(f_data) == 'number')
                  this.act = this.tiledatas[f_data];

                if (get_type(f_data) == 'object')
                  this.act = f_data;

                this._padre.tiledata = this.act;

              },

              get_json() {
                return (JSON.stringify(this.tiledatas))
              },

              default:
              {
                anim_max: 3,

                col:
                  [
                    [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0],// 0 -   9
                    [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0],//10 -  19
                    [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0],//20 -  29
                    [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0],//30 -  39
                    [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0],//40 -  49
                    [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0],//50 -  59
                    [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0],//60 -  69
                    [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0],//70 -  79
                    [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0],//80 -  89
                    [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0],//90 -  99
                    [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0],//100- 119
                  ],

                anim:
                  [
                    [""], [""], [""], [""], [""], [""], [""], [""], [""], [""],// 0 -   9
                    [""], [""], [""], [""], [""], [""], [""], [""], [""], [""],//10 -  19
                    [""], [""], [""], [""], [""], [""], [""], [""], [""], [""],//20 -  29
                    [""], [""], [""], [""], [""], [""], [""], [""], [""], [""],//30 -  39
                    [""], [""], [""], [""], [""], [""], [""], [""], [""], [""],//40 -  49
                    [""], [""], [""], [""], [""], [""], [""], [""], [""], [""],//50 -  59
                    [""], [""], [""], [""], [""], [""], [""], [""], [""], [""],//60 -  69
                    [""], [""], [""], [""], [""], [""], [""], [""], [""], [""],//70 -  79
                    [""], [""], [""], [""], [""], [""], [""], [""], [""], [""],//80 -  89
                    [""], [""], [""], [""], [""], [""], [""], [""], [""], [""],//90 -  99
                    [""], [""], [""], [""], [""], [""], [""], [""], [""], [""],//100- 119
                  ],

                get_json() {
                  return (JSON.stringify(this))
                },
              },




            }
            this.tiledatas._padre = this;

            this.tiledatas.add(this.tiledata, 1);


            this.update_allmax = function () {
              //let _ymax = 0;
              let _xmax = 0;

              for(var u of this.tilemap_0)
              {
                if(u.length>_xmax)
                  _xmax = u.length;
              }


//              this.xt_allmax = this.tilemap_0[0].length; //ancho de nivel en tiles
              this.xt_allmax = _xmax;
              this.yt_allmax = this.tilemap_0.length;    //ancho de nivel en tiles

            }

            this.remade_tilemaps = function (f_h, f_w, f_u = 0) {
              let _tm = crear_multiarray(f_h, f_w, f_u);
              this.update_tilemaps(clone_array(_tm),
                clone_array(_tm),
                clone_array(_tm),

                clone_array(_tm));


            }

            this.update_tilemaps = function (f_tilemap_0 = this.tilemaps[0], f_tilemap_1 = this.tilemaps[1], f_tilemap_2 = this.tilemaps[2], f_tilemap_obj = this.tilemap_obj) {
              this.tilemap_0 = f_tilemap_0;
              this.tilemap_1 = f_tilemap_1;
              this.tilemap_2 = f_tilemap_2;

              this.tilemap_obj = f_tilemap_obj;


              this.tilemaps = [this.tilemap_0, this.tilemap_1, this.tilemap_2];
              this.tilemaps_all = [this.tilemap_0, this.tilemap_1, this.tilemap_2, this.tilemap_obj];

              this.update_allmax();
              this.refresh.force();
            }

            this.update_allmax();



          },


          //ids:[capa0,capa1,capa2], modo: 'x','y', 'all'
          on_draw_tile(fy, fx, modo, ids) //llamado solo una vez por posicion(no 3 capas)
          {
           

          },
          on_draw_stroke(modo) //modo: 'x', 'y', 'all'
          {

          },


          //cut       //offset
          draw_total(f_x, f_y, f_xoff, f_yoff) {


            let _wt = this.wt; let _ht = this.ht; let _tilemap_0 = this.tilemap_0; let _tiledata = this.tiledata;


            // this.canvas_b.ctx.globalCompositeOperation = "copy";

            for (var i = f_y; i < f_y + this.yt_max + 1; i++) {
              for (var j = f_x; j < f_x + this.xt_max + 1; j++) {
                this.on_draw_tile(i, j, 'all');

                if (_tilemap_0[i] != undefined) {

                  for (var k = 0; k < this.tilemaps.length; k++) {

                    _u = this.tile_from_tilemap(this.tilemaps[k], i, j);

                    if (_u !== 0) //MEJORA 11-24-2022
                    //if(_u!==0 && (this.prev_tilemaps[k][i][j] && this.prev_tilemaps[k][i][j][0]!==_u) ) //MEJORA 11-24-2022

                    {

                      let _ysheet = (Math.floor((_u) / 10));
                      let _xsheet = ((_u) - (_ysheet * 10));


                      this.canvasses[k].ctx.drawImage(this.images[0], _xsheet * _wt, _ysheet * _ht, _wt, _ht,

                        (j - f_x + f_xoff) * _wt, (i - f_y + f_yoff) * _ht, _wt, _ht);

                    }

                  }//k
                }
              }
            }

            this.on_draw_stroke('all');

            // this.canvas_b.ctx.globalCompositeOperation = "source-over";

          },

          //y offset
          draw_v_line(f_a, f_b, f_end, f_c) {


            let _wt = this.wt; let _ht = this.ht; let _tilemap_0 = this.tilemap_0;


            let _i = 0;
            //this.canvas_b.ctx.globalCompositeOperation = "copy";
            for (var i = f_c; i < f_c + this.yt_max + 1; i++) {
              let _j = 0;
              for (var j = f_a; j < f_b; j++) {
                this.on_draw_tile(i, j, 'y');

                if (_tilemap_0[i] != undefined) {

                  for (var k = 0; k < this.tilemaps.length; k++) {
                    _u = this.tile_from_tilemap(this.tilemaps[k], i, j);

                    let _ysheet = (Math.floor((_u) / 10));
                    let _xsheet = ((_u) - (_ysheet * 10));

                    //    this.canvasses[k].ctx.globalCompositeOperation = "source-in";

                    this.canvasses[k].ctx.drawImage(this.images[0], _xsheet * _wt, _ysheet * _ht, _wt, _ht,


                      (f_end + _j) * _wt, (_i) * _ht, _wt, _ht);

                    //    this.canvasses[k].ctx.globalCompositeOperation = "copy";
                  }//k

                  _j++;
                }
              }
              _i++;
            }
            this.on_draw_stroke('y');

            //  this.canvas_b.ctx.globalCompositeOperation = "source-over";

          },

          //x offset
          draw_h_line(f_a, f_b, f_end, f_c) {
            let _wt = this.wt; let _ht = this.ht; let _tilemap_0 = this.tilemap_0;


            let _j = 0;
            for (var j = f_c; j < f_c + this.xt_max + 1; j++) {

              let _i = 0;
              for (var i = f_a; i < f_b; i++) {
                this.on_draw_tile(i, j, 'x');

                if (_tilemap_0[i] != undefined) {
                  for (var k = 0; k < this.tilemaps.length; k++) {
                    _u = this.tile_from_tilemap(this.tilemaps[k], i, j);

                    let _ysheet = (Math.floor((_u) / 10));
                    let _xsheet = ((_u) - (_ysheet * 10));


                    this.canvasses[k].ctx.drawImage(this.images[0], _xsheet * _wt, _ysheet * _ht, _wt, _ht,
                      (_j) * _wt, (f_end + _i) * _ht, _wt, _ht);

                  }//k

                  _i++;
                }

              }

              _j++;
            }
            this.on_draw_stroke('x');
          },


          //|tilegesrun
          run() {

            let _tilemap = this.tilemap;
            let _wt = this.wt;
            let _ht = this.ht;


            let _w16 = this.wt; // anchura tile
            let _h16 = this.ht; // altura tile

            let __x = Math.floor(this.x / _w16);
            let __y = Math.floor(this.y / _h16);


            let __xplus = ((__x) - (this.x / _w16)) * _w16;
            let __yplus = ((__y) - (this.y / _h16)) * _h16;


            //=================//
            //      X SCROLL   //
            //=================//


            if (__x != this.xprev_t) {
              let _dif = this.xprev_t - __x;

              if (_dif < 0)//draw right
              {
                _dif = Math.abs(_dif);

                for (var k = 0; k < 3; k++) {
                  this.canvasses[k].ctx.globalCompositeOperation = "copy";
                  //this.canvas_b.ctx.drawImage(this.canvas_b.obj, -(_dif*16),0); 
                  this.canvasses[k].ctx.drawImage(this.canvasses[k].obj, -(_dif * _w16), 0); //scroll canvas
                  this.canvasses[k].ctx.globalCompositeOperation = "source-over";
                }

                this.draw_v_line(this.xprev_t + this.xt_max + 1, this.xprev_t + this.xt_max + _dif + 1 + 1, this.xt_max - _dif + 1,

                  __y + (this.yprev_t - __y));




              }

              else if (_dif > 0)////draw left
              {

                _dif = Math.abs(_dif);

                for (var k = 0; k < 3; k++) {
                  this.canvasses[k].ctx.globalCompositeOperation = "copy";
                  this.canvasses[k].ctx.drawImage(this.canvasses[k].obj, (_dif * _w16), 0); //scroll canvas
                  this.canvasses[k].ctx.globalCompositeOperation = "source-over";
                }
                this.draw_v_line(__x, __x + _dif, 0,
                  __y + (this.yprev_t - __y));
              }

            }



            //=================//
            //      Y SCROLL   //
            //=================//

            if (__y != this.yprev_t)//yscroll
            {

              let _dif = this.yprev_t - __y;


              if (_dif < 0)//draw abajo
              {

                _dif = Math.abs(_dif);
                for (var k = 0; k < 3; k++) {
                  this.canvasses[k].ctx.globalCompositeOperation = "copy";
                  this.canvasses[k].ctx.drawImage(this.canvasses[k].obj, 0, -(_dif * _h16)); //scroll canvas
                  this.canvasses[k].ctx.globalCompositeOperation = "source-over";
                }

                this.draw_h_line(this.yprev_t + this.yt_max + 1, this.yprev_t + this.yt_max + _dif + 1 + 1, this.yt_max - _dif + 1,
                  __x);

              }


              else if (_dif > 0)////draw arriba
              {

                _dif = Math.abs(_dif);

                for (var k = 0; k < 3; k++) {
                  this.canvasses[k].ctx.globalCompositeOperation = "copy";
                  this.canvasses[k].ctx.drawImage(this.canvasses[k].obj, 0, (_dif * _h16)); //scroll canvas
                  this.canvasses[k].ctx.globalCompositeOperation = "source-over";
                }

                this.draw_h_line(__y, __y + _dif, 0,
                  __x);

              }
            }
            //========
            //ys...
            //=======




            //===============
            // draw total
            //===============
            this.refresh.run(__x, __y);

            //=========
            //...drw t
            //=========


            //=============
            //pindado final
            //=============

            let _xout_t = 0;
            let _yout_t = 0;
            let _xfloor = Math.floor(this.x);
            let _xfloor16 = Math.floor(this.x / _w16);
            let _yfloor = Math.floor(this.y);
            let _yfloor16 = Math.floor(this.y / _h16);


            if (this.x < 0)
              _xout_t = -Math.floor(_xfloor16);


            if (this.x + (this.xt_max * _w16) > this.xt_allmax * _w16)
              _xout_t = Math.floor(((this.xt_allmax * _w16) - ((_xfloor + 1) + (this.xt_max * _w16))) / _w16);


            if (this.y < 0)
              _yout_t = -Math.floor(_yfloor16);


            if (this.y + (this.yt_max * _h16) > this.yt_allmax * _h16)
              _yout_t = Math.floor(((this.yt_allmax * _h16) - ((_yfloor + 1) + (this.yt_max * _h16))) / _h16);




            for (var k = 0; k < 3; k++) {
              this.canvasses[k].drawcords = [_xout_t * _w16, _yout_t * _h16, (this.xt_max + 1) * this.wt, (this.yt_max + 1) * this.ht,

              Math.floor(_xout_t * _w16 + __xplus), Math.floor(_yout_t * _h16 + __yplus),
              (this.xt_max + 1) * this.wt, (this.yt_max + 1) * this.ht
              ];
            }



            this.xprev_t = __x;
            this.yprev_t = __y;
            this.xprev = this.x;
            this.yprev = this.y;

          },


          fill(tilemap_id, f_id) {
            for (var i = 0; i < this.yt_allmax; i++) {
              for (var j = 0; j < this.xt_allmax; j++) {
                this.tilemaps[tilemap_id][i][j] = f_id;
              }
            }

          },

          clear_total() {
            console.clear();
            for (var i in this.tilemaps) {
              this.fill(i, 0);
            }
            this.refresh.force();
          },

          clear(f_id) {
            console.clear();

            this.fill(f_id, 0);

            this.refresh.force();
          },

          get_tilemap(f_k) {

            return (JSON.stringify(this.tilemaps[f_k]));

          },

        },


        //end tileges
        //===========


        //========
        //MISC
        //========

        //|crear_vacio  WEAK
        crear_vacio(f_donde, f_canvas_id, f_data) {
          if (arguments.length == 1) {
            arguments['donde'] = this._root;
            arguments['canvas_id'] = 0;
            arguments['data'] = {};
          }
          if (arguments.length == 2) {
            arguments['donde'] = arguments[0];
            arguments['canvas_id'] = 0;
            arguments['data'] = arguments[1];
          }
          if (arguments.length == 3) {
            arguments['donde'] = arguments[0];
            arguments['canvas_id'] = arguments[1]
            arguments['data'] = arguments[2];
          }


          let _data = setloop_prop({
            canvas: this.canvasses[arguments['canvas_id']].obj,
            ctx: this.canvasses[arguments['canvas_id']].ctx,

          }, arguments['data']);

          let _clip = GAME.crear_vacio(arguments['donde'], _data);

          return (_clip);
        },


        //|crear_imagen   WEAK
        crear_imagen(f_donde, f_id, f_canvas_id, f_data) {
          if (arguments.length == 2) {
            arguments['donde'] = arguments[0];
            arguments['img_id'] = arguments[1];
            arguments['canvas_id'] = 0;
            arguments['data'] = {};
          }

          if (arguments.length == 3) {
            arguments['donde'] = arguments[0];
            arguments['img_id'] = arguments[1];
            arguments['canvas_id'] = 0;
            arguments['data'] = arguments[2];
          }
          if (arguments.length == 4) {
            arguments['donde'] = arguments[0];
            arguments['img_id'] = arguments[1];
            arguments['canvas_id'] = arguments[2];
            arguments['data'] = arguments[3];

          }

          let _image = arguments['img_id'];
          if (get_type(arguments['img_id']) == 'number')
            _image = this.LIB_IMAGES[arguments['img_id']];


          let _data = setloop_prop({
            image: _image,

            canvas: this.canvasses[arguments['canvas_id']].obj,
            ctx: this.canvasses[arguments['canvas_id']].ctx,
          }, arguments['data']);


          return (GAME.crear_imagen(arguments['donde'], _data));

        },
        //                      lib_image
        //|crear_sprite  WEAK    |                //necesita GAME.crear_animdata
        crear_sprite(f_donde, f_id, f_canvas_id, f_data) {

          if (arguments.length == 3) {
            arguments['donde'] = arguments[0];
            arguments['img_id'] = arguments[1]
            arguments['canvas_id'] = 0;
            arguments['data'] = arguments[2];
          }

          if (arguments.length == 4) {
            arguments['donde'] = arguments[0];
            arguments['img_id'] = arguments[1]
            arguments['canvas_id'] = arguments[2]
            arguments['data'] = arguments[3];
          }


          let _image = arguments['img_id'];
          if (get_type(arguments['img_id']) == 'number')
            _image = this.LIB_IMAGES[arguments['img_id']];



          let _data = setloop_prop({
            animdata: "NEED",

            image: _image,
            canvas: this.canvasses[arguments['canvas_id']].obj,
            ctx: this.canvasses[arguments['canvas_id']].ctx,
          }, arguments['data']);


          return (GAME.crear_sprite(arguments['donde'], _data));

        },

        //|cargar_clip
        cargar_clase(f_donde, f_id, f_data) //weak
        {
          let _class = {};


          if (get_type(f_id) !== 'array') {
            f_id = [f_id];
          }

          for (var u of f_id) //aplicacion clases anidadas
          {

            let _class2;

            if (get_type(u) == 'number') {
              _class2 = clone_object(this.LIB_CLASES[u]);
            }

            else if (get_type(u) == 'object') {
              _class2 = clone_object(u);
            }

            if (f_id.length == 1)
              _class = _class2;

            else
              _class = setloop_prop(_class, _class2);


          }



          _class = setloop_prop(_class, f_data);







          let _ret = _class;


          if (_class.LOAD.canvas_id == undefined)
            _class.LOAD.canvas_id = 0;


          if (_class.LOAD.modo == "vacio") {


            _ret = (this.crear_vacio(f_donde, _class.LOAD.canvas_id, _class));

          }

          if (_class.LOAD.modo == "imagen")  //NEED LOAD{modo:'imagen', id:n, }
          {

            _ret = (this.crear_imagen(f_donde, _class.LOAD.id, _class.LOAD.canvas_id, _class));
          }

          if (_class.LOAD.modo == "sprite") {


            _class.animdata = _class.LOAD.animdata;


            _ret = (this.crear_sprite(f_donde, _class.LOAD.id, _class.LOAD.canvas_id, _class));

          }

          //sub clases
          _child = _class.LOAD.child;
          if (_child !== undefined) {

            if (get_type(_child) !== 'array') {
              _child = [_child];
            }

            for (var u of _child) {
              this.cargar_clase(_ret, u);
            }

          }

          

          //enterload(_ret); //add 01-16-2024
          if (_ret.loadframe_state != 1 && _ret.loadframe != undefined) //ejecutar loadframe si no se ha iniciado
          {
          window['$enterload'] = _ret;
          _ret.loadframe();
          _ret.loadframe_state = 1;
          //_ret._draw(); //metacall
          }


          return (_ret);

        },

      }



      _foo.tileges.padre = _foo;
      _foo.fondoges.padre = _foo;


      f_donde.hijos.splice(0, 0, _foo);

      f_donde.update_hijos_depth();

      f_donde.gameges = _foo;


      f_donde.gameges._root = f_donde.gameges.crear_vacio(f_root.donde, f_root);
      f_root.donde._root = f_donde.gameges._root;

      f_donde.gameges.$.root = f_donde.gameges._root;

      //definicion $
      _foo.$.gameges = _foo;
      _foo.$.tileges = _foo.tileges;
      _foo.$.fondoges = _foo.fondoges;
      _foo.$.root = f_donde.gameges._root;
      _root.set_$(_foo);

      return (_foo);

    },





    //||crear_vacio
    crear_vacio(f_donde, f_data) {


      let _data = setloop_prop(
        {
          _is: "clip",
          modo: "vacio",
          is_clip: 1,

          image: "",
          canvas: '',
          ctx: '',

          draw_color: "",
          x: 0, px: 0, rx: 0,//px =padre x; rx = x + px
          y: 0, py: 0, ry: 0,
          w: 0,
          h: 0,

          rotation:0,
          rotation_c:[0,0], //x,y

          visible: 1,
          active: 1,

          z: "", // "" -> final ;  logica -> cada vez que se suma un hijo via crear_clip_vacio(), se recalcula hijos_clips de acuerdo a este valor
          //                          la estructura final del array no tiene relacion directa con z; solo el orden de dibujo


          padre: f_donde,


          pixel_size: 1,

          hijos_clip: [],
          hijos: [], //compatibilidad
          loadframe_state: 0,
          propagar_enterframe: 1,

          _DEL: 0, //al interpretar [enterframe recursivo], eliminar
          loadframe() {

          },
          enterframe() {

          },

          _draw() //metafuncion
          {
           
            this.rx = Math.floor(this.x + this.px);
            this.ry = Math.floor(this.y + this.py);
            
            if(this.w=='') //workaround establecer w h de sprite al inicio
            this.draw(0);

            if (this.visible == 1) {
              if (this.draw_color !== "") {
                this.ctx.fillStyle = this.draw_color;
                this.ctx.fillRect(this.rx, this.ry, this.w, this.h)
              }
              this.draw();
            }
          },

          draw() //funcion personalizable
          {


          },

          draw_image() //funcion general para aplicar filtros, etc...
          {
            if(this.modo=='imagen' && this.image==='') return;

            
              

            if (this.filter !== undefined) {

              let _type = get_type(this.filter);
              let _string = "none";
              if (_type == 'object') {

                _string = "";
                for (var u in this.filter) {

                  let _v = this.filter[u];
                  if (u == 'hue' || u == 'hueRotate')
                    _string += 'hue-rotate(' + _v + 'deg) ';

                  if (u == 'shadow' || u == 'dropShadow')
                    _string += 'drop-shadow(' + _v + ') ';

                  if (u == 'blur')
                    _string += 'blur(' + _v + 'px) ';

                  if (u == 'contrast')
                    _string += 'contrast(' + _v + '%) ';

                  if (u == 'grayscale')
                    _string += 'grayscale(' + _v + '%) ';

                  if (u == 'brightness')
                    _string += 'brightness(' + _v + '%) ';

                  if (u == 'invert')
                    _string += 'invert(' + _v + '%) ';

                  if (u == 'opacity')
                    //this.ctx.globalAlpha = _v;  [edit 09/27/2023]
                    _string += 'opacity(' + _v + '%) ';

                  if (u == 'saturate')
                    _string += 'saturate(' + _v + '%) ';

                  if (u == 'sepia')
                    _string += 'sepia(' + _v + '%) ';


                }

              }
              this.ctx.filter = _string;
              // console.log(_string)

              // this.ctx.filter = "hue-rotate(90deg)";  
            }

            if (arguments.length == 5)
            {

              if(this.rotation!==0)
              {
              //this.ctx.setTransform(1, 0, 0, 1,  this.px+this.x , this.py+this.y ); // sets scale and origin
              this.ctx.setTransform(1, 0, 0, 1,  arguments[1]+this.rotation_c[0], arguments[2]+this.rotation_c[1]);
              this.ctx.rotate(this.rotation);
              
              //this.ctx.drawImage(arguments[0], -this.w/2, -this.w/2, arguments[3], arguments[4]);
              this.ctx.drawImage(arguments[0], -this.rotation_c[0], -this.rotation_c[1],  arguments[3], arguments[4]);

              this.ctx.setTransform(1,0,0,1,0,0);
              }

              else
              this.ctx.drawImage(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
            }

            if (arguments.length == 9)
            {
              if(this.rotation!==0)
              {
              //this.ctx.setTransform(1, 0, 0, 1,  this.px+this.x , this.py+this.y ); // sets scale and origin
              this.ctx.setTransform(1, 0, 0, 1,  arguments[5]+this.rotation_c[0], arguments[6]+this.rotation_c[1]);
              this.ctx.rotate(this.rotation);
              
              this.ctx.drawImage(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4],

                                               -this.rotation_c[0], -this.rotation_c[1],    arguments[7], arguments[8]);

              this.ctx.setTransform(1,0,0,1,0,0);
              }
              else
              this.ctx.drawImage(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);


              
               

            }


            this.ctx.filter = "none";
            this.ctx.globalAlpha = 1;

          },


          on_remove() {

          },
          remove() {
            if (this._DEL == 0)
              this.on_remove(this);

            this._DEL = 1;

          }

        },


        f_data);


      //crear a partir de prototipo 
      if (get_type(_data.proto) == 'object') {
        _data = protobj(_data.proto, _data);
      }


      if (_data.z === "")//tirar al final (por defecto)
      {
        let _z;
        if (f_donde.hijos_clip.length == 0)
          _z = 0;

        else
          _z = f_donde.hijos_clip[f_donde.hijos_clip.length - 1].z + 1;

        _data.z = _z;
        f_donde.hijos_clip.push(_data);

      }
      else {

        for (var i = 0; i < f_donde.hijos_clip.length; i++) {
          let u = f_donde.hijos_clip[i];

          if (u.z > _data.z) {
            f_donde.hijos_clip.splice(f_donde.hijos_clip[i - 1], 0, _data);
            break;
          }

          if (u.z == _data.z) {
            for (var j = i; j < f_donde.hijos_clip.length; j++) {
              f_donde.hijos_clip[j].z++;
            }
            f_donde.hijos_clip.splice(f_donde.hijos_clip[i], 0, _data);

            break;
          }

          if (i == f_donde.hijos_clip.length - 1)
            f_donde.hijos_clip.push(_data);

        }


      }


      //atajo definicion referencianombre dentro de destino
      if (_data.nombre !== undefined)
        f_donde[f_data.nombre] = _data;

      padrear(_data);
      return (_data);

    },

    //||crear_imagen
    crear_imagen(f_donde, f_data) {


      let _data = GAME.crear_vacio(f_donde, {

        modo: 'imagen',
        w: f_data.image.naturalWidth,
        h: f_data.image.naturalHeight

      });

      _data = setloop_prop(_data, f_data);

      _data.draw = function () {
         
            
            
           // {
            // _end_image = this.image.flip_x[1];
            //}
            
             
        let _iw = this.image.width;
        let _ih = this.image.height;

        if (esundempty(this.cut_cords)) {

          //this.ctx.drawImage(this.image,  this.rx,this.ry,  this.w,  this.h); 
          this.draw_image(this.image, this.rx, this.ry, this.w, this.h);

        }
        else {
          //this.ctx.drawImage(this.image,   this.cut_cords.x,this.cut_cords.y, this.cut_cords.w, this.cut_cords.h,
          //                                                                 rx,ry,  this.w,  this.h);                     
           if(this.image.flip_x==undefined || this.flip_x!==1)
           {
           
            this.draw_image(this.image, this.cut_cords.x, this.cut_cords.y, this.cut_cords.w, this.cut_cords.h,
                             this.rx, this.ry, this.w, this.h);
           }
           else
           {
            this.draw_image(this.image.flip_x[1], _iw-this.cut_cords.w-this.cut_cords.x, this.cut_cords.y, this.cut_cords.w,  this.cut_cords.h,
                                                 this.rx, this.ry, this.w, this.h);
           
           }

        }

      }

      return (_data);
    },




    //{}
    //[{},{}]
    //[0,1,2]
    //[[0,1],[0,1]]

    //{},  
    crear_animdata(f_master, _args) {

      //simplificador definidor act 
      if (get_type(f_master.act) == 'number') f_master.act = [f_master.act, 0, 0];


      let _animdata = setloop_prop(
        {
          tt: 0,
          pause:0,
          act: [0, 0, 0], //anim, frame, loop

          set_anim(f_n = this.act[0], f_force = 0) {

            if (f_force == 1 || this.act[0] !== f_n) {

              this.act[0] = f_n;
              this.act[2] = 0;//loop count
              let _anim = this.animations[this.act[0]];
              if (_anim.reverse == 0) {
                this.act[1] = 0;
                this.tt = 0;
              }
              else if (_anim.reverse == 1) {

                this.act[1] = _anim.buf.length - 1;
                this.tt = 0;
              }
            }
          },

          force: //no aplica si es ""
          {
            flip: "", //[x, y]
            reverse: "", //0,1
            offset: "", //[x, y]
            ll: ""
          },
          master:
          {
            flip: [0, 0], //[x, y] solo x provisorio
            ll: 1,
            reverse: 0,
            loop: 0,
            offset: [0, 0],
            remove_on_loop: 0,

            wt: 16,
            ht: 32,
            //x,y
            buf: [[0, 0]]
          },

        }
        ,
        f_master
      );


      let _animations = [];
      let u;
      for (var i = 1; i < arguments.length; i++) {
        u = arguments[i];

        if (get_type(u) == 'object') {
          setprop_unex(u, _animdata.master);
          _animations.push(u);
        }

        if (get_type(u) == 'array') {
          let _foo = { buf: u };
          setprop_unex(_foo, _animdata.master);

          _animations.push(_foo)

        }

      }


      _animdata.animations = _animations;

      return (_animdata);


    },

    //||crear_sprite         //necesita GAME.crear_aimdata
    crear_sprite(f_donde, f_data) {


      let _data = GAME.crear_vacio(f_donde, {
        animdata: "NEED",

        modo: 'sprite',
        wn: f_data.image.naturalWidth,
        hn: f_data.image.naturalHeight,

        w: "", //relativo anchura ultimo frame
        h: "", //relativo altura  ultimo frame            

      }
      );


      _data = setloop_prop(_data, f_data);

      _data.animdata.set_anim(_data.animdata.act[0], 1);

      _data.draw = function (f_draw=1) {
        let _ctx = _data.ctx;


        let _animdata = _data.animdata;
        let _animations = _data.animdata.animations;
        let _act = _animdata.act; //[n,n]

        let _anim = _animdata.animations[_animdata.act[0]];
        let _buf = _anim.buf;
        let _buf_n = _anim.buf[_animdata.act[1]];
        let _wn = this.wn;
        let _hn = this.hn;


        let _reverse = dualset(_anim.reverse, _animdata.force.reverse);
        let _loop    = dualset(_anim.loop, _animdata.force.loop);
        let _flip    = dualset(_anim.flip, _animdata.force.flip);
        let _ll      = dualset(_anim.ll, _animdata.force.ll);

        //coord corte
        let _end = [[0, 0, 0, 0],
        [this.rx, this.ry, 50, 50],
        this.image.flip_x[0]
        ];
        //coord final

        if (_buf_n.length == 2) {

          if (_flip[0] == 0) {
            _end[0][0] = _buf_n[0] * _anim.wt;
            _end[0][1] = _buf_n[1] * _anim.ht;
            _end[0][2] = _anim.wt;
            _end[0][3] = _anim.ht;

            _end[2] = this.image.flip_x[0];

          }
          if (_flip[0] == 1) {
            _end[0][0] = _wn - ((_buf_n[0] + 1) * _anim.wt);
            _end[0][1] = _buf_n[1] * _anim.ht;
            _end[0][2] = _anim.wt;
            _end[0][3] = _anim.ht;
            _end[2] = this.image.flip_x[1];
          }

          if (_flip[1] == 1) {

            _end[0][0] = _buf_n[0] * _anim.wt;
            _end[0][1] = _hn - ((_buf_n[1] + 1) * _anim.ht);

            _end[0][2] = _anim.wt;
            _end[0][3] = _anim.ht;

            _end[2] = this.image.flip_y[1];
          }

          _end[1][0] = _data.rx + _anim.offset[0];
          _end[1][1] = _data.ry + _anim.offset[1];
          _end[1][2] = _anim.wt;
          _end[1][3] = _anim.ht;

        }

        else if (_buf_n.length == 4) {

          if (_flip[0] == 0) {
            _end[0][0] = _buf_n[0];
            _end[0][1] = _buf_n[1];
            _end[0][2] = _buf_n[2];
            _end[0][3] = _buf_n[3];
            _end[2] = this.image.flip_x[0];
          }
          if (_flip[0] == 1) {

            _end[0][0] = _wn - _buf_n[0] - _buf_n[2];
            _end[0][1] = _buf_n[1];
            _end[0][2] = _buf_n[2];
            _end[0][3] = _buf_n[3];
            _end[2] = this.image.flip_x[1];
          }

          if (_flip[1] == 1) {
            _end[0][0] = _buf_n[0];
            _end[0][1] = _hn - _buf_n[1] - _buf_n[3];
            _end[0][2] = _buf_n[2];
            _end[0][3] = _buf_n[3];
            _end[2] = this.image.flip_y[1];
          }

          _end[1][0] = _data.rx + _anim.offset[0];;
          _end[1][1] = _data.ry + _anim.offset[1];;
          _end[1][2] = _buf_n[2];
          _end[1][3] = _buf_n[3];
        }


        //usad en pintado de fondo
        
        if(this._w)_end[1][2]=this._w;
        if(this._h)_end[1][3]=this._h;

        this.w = _end[1][2];
        this.h = _end[1][3];



        //control frames
        if(_animdata.pause==0)
        _animdata.tt++;


        if (_animdata.tt > _ll) {
          _animdata.tt = 0;


          if (_reverse == 0) {
            if (_animdata.act[1] < _buf.length - 1) {
              _animdata.act[1]++;
            }

            else if (_animdata.act[1] == _buf.length - 1) {

              if (_anim.remove_on_loop == 1) {
                if (_loop == 0 || _loop > 0 && _animdata.act[2] == _loop - 1)
                  this._DEL = 1;
              }


              if (_loop == 0 || _animdata.act[2] < _loop - 1) {
                _animdata.act[1]++;

              }

            }

            if (_animdata.act[1] > _buf.length - 1) {
              _animdata.act[1] = 0;
              _animdata.act[2]++;
            }
          }

          else if (_reverse == 1) {
            if (_animdata.act[1] > 0) {
              _animdata.act[1]--;
            }

            else if (_animdata.act[1] == 0) {

              if (_anim.remove_on_loop == 1) {
                if (_loop == 0 || _loop > 0 && _animdata.act[2] == _loop - 1)
                  this._DEL = 1;
              }

              if (_loop == 0 || _animdata.act[2] < _loop - 1) {
                _animdata.act[1]--;
              }
            }

            if (_animdata.act[1] < 0) {
              _animdata.act[1] = _buf.length - 1;
              _animdata.act[2]++;
            }
          }

        }


        /*_ctx.drawImage(_end[2],  
                                  _end[0][0],_end[0][1],_end[0][2],_end[0][3],
                                  _end[1][0],_end[1][1],_end[1][2],_end[1][3],
                                  
                                 ); 
        */
        if(f_draw)
        {
        this.draw_image(_end[2],
          _end[0][0], _end[0][1], _end[0][2], _end[0][3],
          _end[1][0], _end[1][1], _end[1][2], _end[1][3],

        );
        }



      }


      return (_data);
    },




  },






  script: {
    url_filename_limpio(f_url) {
      return (f_url.substring(f_url.lastIndexOf('/') + 1));
    },
  },



  //=============
  //|ventana
  //==============
  ventana:
  {

    crear_ventana(f_donde, f_data, f_skin = [undefined, {}]) {

      if (get_type(f_data.titulo) != 'object')
        f_data.titulo = { titulo: f_data.titulo }

      if (get_type(f_data.borde) == 'number')
        f_skin[1].borde = [f_data.borde, f_data.borde, f_data.borde, f_data.borde];

      if (get_type(f_data.borde) == 'array')
        f_skin[1].borde = f_data.borde;

      if (f_data.grab == 1 && f_data.titulo !== undefined) {
        f_data.titulo.grab = 1;
      }
      if (f_data.grab !== undefined) {
        delete f_data.grab;

      }

      let _data = setloop_prop(
        {
          _tipo: "ventana",

          skin: //to;do
          {

          },

          x: 0,
          y: 0,
          w: 200,
          h: 200,

          load: 0,

          titulo: {
            titulo: undefined,
            xb: 1,
            grab: 0,
          },
          resize: 0,

          padre_ventana: "",
          hijos_ventanas: [],

          out_snap: [0, 0, 0, 0], //n || '': no aplica


          al_cargar_recursos() {

          },

          on_close() {

          },

          cerrar() {
            let _ven = this;
            //desbloquear padre si es ventana anidada
            if (esundempty(_ven.padre_ventana) == 0) {

               setTimeout(()=>{_ven.padre_ventana.obj.focus()},10);

              _ven.padre_ventana.hijos_ventanas.splice(_ven.hijo_ventana_id, 1);
              _ven.padre_ventana.__update_hijoventana_ids();

              if (_ven.padre_ventana.hijos_ventanas.length == 0) {
                _ven.padre_ventana.unlock();
                _ven.padre_ventana.hijos_ventanas = [];
              }
            }

            _ven.remove();


            call_funarr(_ven.on_close);

          },


          get_literal_size(f_w = this.wr, f_h = this.hr) {
            let _ven = this;
            let _borde = _ven.skin.borde;
            return ({
              w: (f_w + _borde[0] + _borde[2] + 2),
              h: (f_h + _borde[1] + _borde[3] + 2 + _ven._bloque.yr + 2)
            })

          },

          set_literal_size(f_w, f_h) {
            let _ven = this;
            let _borde = _ven.skin.borde;
            //if (f_w) _ven.set_w(f_w + _borde[0] + _borde[2] + 2); // 
            //if (f_h) _ven.set_h(f_h + _borde[1] + _borde[3] + 2 + _ven._bloque.yr + 2);
            if (f_w) _ven.set_w(f_w + _borde[0] + _borde[2] + 2); //
            if (f_h) _ven.set_h(f_h + _borde[1] + _borde[3] + 2 + _ven._bloque.yr + 4);//fix bug 01/29/2024
          },

          load_isc(f_images = [], f_sounds = [], f_clases = [], f_callback = this.al_cargar_recursos) {
            LOAD_ISC(f_images, f_sounds, f_clases, this, f_callback);
          },

          load_isct(f_images = [], f_sounds = [], f_clases = [], f_three, f_callback = this.al_cargar_recursos) {
            LOAD_ISCT(f_images, f_sounds, f_clases, f_three, this, f_callback);
          },

          crear_teclado() {
            TECLADO.crear_teclado(_ven);
          },

          crear_subventana(f_data, f_skin) {
            let _ven = this;
            let _data;
            _data = setloop_prop(
              {
                pos_relativa: 1,
                x: 0,
                y: 0,
                w: 100,
                h: 100,
              },

              f_data

            )

            if (_data.pos_relativa == 1) {
              _data.x += _ven.xr;
              _data.y += _ven.yr;
            }

            _ven.set_depth('movelast');

            let _subwin = ventana.crear_ventana(_root, _data, f_skin);

            _subwin.padre_ventana = _ven;

            _ven.lock();

            _subwin.hijo_ventana_id = _ven.hijos_ventanas.length;

            _ven.hijos_ventanas.push(_subwin);



            for (var u of _ven.hijos_ventanas) {
              u.set_depth(0, 'movelast');
            }


            //al hacer click fantasmabloque -> dar depth maxima a todo
            _ven.locked.odiv.obj.onmousedown = function () {

              //'frontear' padres recursivos==========
              //
              let _padreventanas = [];
              _rec = function (_u) {
                if (_u.padre_ventana !== "") {
                  _padreventanas.push(_u.padre_ventana);

                  _rec(_u.padre_ventana)

                }
              }

              _rec(_ven);


              for (var i = 0; i < _padreventanas.length; i++) {
                let _u = _padreventanas[i];
                _u.set_depth(0, "movelast");
              }
              //======================================



              _ven.set_depth(0, 'movelast');

              for (var i in _ven.hijos_ventanas) {
                let _u = _ven.hijos_ventanas[i];
                _u.set_depth(0, 'movelast');
                if (_u.hijos_ventanas.length > 0) {
                  _u.locked.odiv.obj.onmousedown();
                }
              }
            }


            return (_subwin);

          },

          force_front() //funcion apartada para llamada via click iframe
          {
            let _ven = this;

            if (_ven.locked.locked == 0) {

              if (esundempty(_ven.padre_ventana) == 0) {

                //'frontear' padres recursivos==========
                //
                let _padreventanas = [];
                _rec = function (_u) {
                  if (_u.padre_ventana !== "") {
                    _padreventanas.push(_u.padre_ventana);

                    _rec(_u.padre_ventana)

                  }
                }

                _rec(_ven);


                for (var u of _padreventanas) {
                  u.set_depth(0, "movelast");
                }

                //========================================


                _ven.padre_ventana.hijos_ventanas.splice(_ven.hijo_ventana_id, 1)
                _ven.padre_ventana.hijos_ventanas.push(_ven)

                _ven.padre_ventana.set_depth(0, "movelast");

                for (var i = 0; i < _ven.padre_ventana.hijos_ventanas.length; i++) {
                  let _u = _ven.padre_ventana.hijos_ventanas[i];
                  _u.set_depth(0, "movelast");
                  _u.hijo_ventana_id = i;
                }
              }
              _ven.set_depth(0, "movelast");

            }

          }, //end force_front


          __update_hijoventana_ids() {
            let _ven = this;
            for (var i in _ven.hijos_ventanas) {
              let _u = _ven.hijos_ventanas[i];
              _u.hijo_ventana_id = i;
            }
          },

          ini_$() {

            this.$.WIN = this;
            this.$.BLOQUE = this.macrobloque.bloque;
            this.$.TECLADO = this.teclado;
            this.$.CURSOR = this.cursor;
            this.$.CURSOR_BLOQUE = this.cursor_bloque;
          },
          get_title()
          {
           return(_ven.macrobloque.header.titulo.texto.obj.innerHTML);
          },

          set_title(f_data) {

            if (this.macrobloque.header !== undefined && this.macrobloque.header.titulo !== undefined) {

              if (get_type(f_data) == "number")
                f_data = f_data.toString();

              if (get_type(f_data) == "string") //aplicacion directa de string
                _ven.macrobloque.header.titulo.texto.obj.innerHTML = f_data;

              if (get_type(f_data) == "object" && f_data.texto !== undefined) //se recibe object.texto;
                _ven.macrobloque.header.titulo.texto.obj.innerHTML = f_data.texto;
            }

          },
          crear_escenario(f_inid, f_this, f_data) {
            let _ven = this;
            let _inid;
            let _this;
            let _data;

            if (arguments.length == 1) {
              _inid = 0;
              _this = _ven._bloque;
              _data = f_inid;
            }

            if (arguments.length == 2) {
              _inid = f_inid;
              _this = _ven._bloque;
              _data = f_this;
            }

            if (arguments.length >= 3) {
              _inid = f_inid;
              _this = f_this;
              _data = f_data;
            }


            ESCENARIO.crear_escenario(_ven, _ven._bloque, _this, _data, _inid) //activado via enterframe general

          },


          ordenar_bloques() //v 3.0
          {

            let _ven = this;
            let _macrobloque = this.macrobloque;
            let _bloque = this.macrobloque.bloque;
            let _header = this.macrobloque.header;


            let s_kin = _ven.skin;
            let s_main = _ven.skin.main;
            let s_macrobloque = _ven.skin.macrobloque;
            let s_bloque = _ven.skin.bloque;

            let s_header = _ven.skin.header;
            let s_titulo = _ven.skin.header.titulo;


            let _borde = _ven.skin.borde;


            _macrobloque.set(0, 0, [_borde[0], _borde[2]], [_borde[1], _borde[2]]);


            let _header_h = 0;

            if (ex(_header)) {


              _header_h = ex(_header.titulo) * s_header.titulo.h +
                ex(_header.menu) * s_header.menu.h;


              set_style(_header.obj, s_header.style);

              _header.set(0, 0, 'full', _header_h);


              if (ex(_header.titulo)) {
                _header.titulo.set(0, 0, "full", s_header.titulo.h);
                set_style(_header.titulo.obj, s_titulo.style);
                set_style(_header.titulo.texto.obj, s_titulo.texto.style);

              }

              if (ex(_header.menu)) {


                _header.menu.set(0, ex(_header.titulo) * s_header.titulo.h, [0, 0], s_header.menu.h);
                set_style(_ven.macrobloque.header.menu.obj, s_header.menu.style);

              }

            }


            _bloque.set(0, 0, [0, 0], [_header_h, 0]);


            set_style(_ven.obj, s_main.style);
            set_style(_ven.macrobloque.obj, s_macrobloque.style);
            set_style(_ven.macrobloque.bloque.obj, s_bloque.style);

            _ven.update();


          },//fin ordenar_bloques





        },
        f_data

      );



      if (_data.metadata == 1) {
        window['$METADATA'] =
        {
          w: _data.w,
          h: _data.h,
          titulo: _data.titulo,
          menu: _data.menu,
        }
      }

      let _skin = setloop_prop(SKIN.get_ventana(f_skin[0]), f_skin[1]);
      _data.skin = _skin;



      //==========================   
      //Creacion odivs principales
      //__________________________

      let _ven = crear_odiv(f_donde, _data.x, _data.y, _data.w, _data.h, {}, { cuadrar_hijos: 1 });

      setloop_prop(_ven, _data);


      _ven.macrobloque = crear_odiv(_ven, 0, 0, 0, 0, {}, { cuadrar_hijos: 1 });

      _ven.macrobloque.bloque = crear_odiv(_ven.macrobloque, 0, 0, 0, 0, {}, { cuadrar_hijos: 1, modo_borde: "interno" });

      _ven._bloque = _ven.macrobloque.bloque;


      //=======
      //titulo

      if (f_data.titulo.titulo !== undefined) {

        if (_ven.macrobloque.header == undefined)
          _ven.macrobloque.header = crear_odiv(_ven.macrobloque, 0, 0, 0, 0, {}, { modo_borde: "interno", cuadrar_hijos: 1, });


        _ven.macrobloque.header.titulo = crear_odiv(_ven.macrobloque.header, 0, 0, 0, 0, "", { modo_borde: "interno", cuadrar_hijos: 1, });

        _ven.macrobloque.header.titulo.texto = crear_odiv(_ven.macrobloque.header.titulo, 0, 0, [0, 0], [0, 0]);


        //botones

        if (_data.titulo.xb == 1 || _data.titulo.xboton == 1) {

          let s_boton = _skin.header.titulo.xb;

          let _boton = crear_odiv(_ven.macrobloque.header.titulo, s_boton.x, s_boton.y, s_boton.w, s_boton.h, "", { x_orientacion: "der", },);
          _ven.macrobloque.header.titulo.xboton = _boton;
          crear_odiv_image(_boton, s_boton.img, 0, 0, [0, 0], [0, 0], { border: 'none' });


          set_style(_boton.obj, s_boton.style);
          _boton.obj[onmousedown_ontouchstart] = function () {
            _ven.cerrar();
          }


        }


        if (_ven.titulo.grab == 1) {

          CURSOR.crear_grab(_ven, _ven.macrobloque.header.titulo.texto,
            {
              onmouseup() {
                let _out = _ven.out_snap;

                if (_out[2] !== "" && _ven.x + _ven.wr > window.innerWidth - _out[2]) {
                  _ven.x = window.innerWidth - _out[2] - _ven.wr;
                }

                if (_out[3] !== "" && _ven.y + _ven.hr > window.innerHeight - _out[3]) {
                  _ven.y = window.innerHeight - _out[3] - _ven.hr;
                }


                if (_out[0] !== "" && _ven.x < _out[0]) {
                  _ven.x = _out[0];
                }

                if (_out[1] !== "" && _ven.y < _out[1]) {
                  _ven.y = _out[1];
                }



              }

            }
          );

        }//...grab


      }//titulo



      if (_ven.menu !== undefined) {

        if (_ven.macrobloque.header == undefined)
          _ven.macrobloque.header = crear_odiv(_ven.macrobloque, 0, 0, 0, 0, {}, { modo_borde: "interno", cuadrar_hijos: 1, });



        _ven.macrobloque.header.menu = crear_odiv(_ven.macrobloque.header, 0, 0, 0, 0, { border: '1px solid blue' }, { modo_borde: "interno" });

        let _menu_this = _ven.menu_this;
        if (_menu_this == undefined) _menu_this = _ven;

        MENU.crear_menu(_ven.macrobloque.header.menu, _ven.menu, { this: _menu_this })

      }




      if (_ven.resize == 1) {
        let _borde = _ven.skin.borde;
        CURSOR.crear_resize(_ven, {
          borde: [_borde[0] + 1, _borde[1] + 1, _borde[2] + 1, _borde[3] + 1],
        });
      }


      if (_ven.teclado == 1) {
        TECLADO.crear_teclado(_ven);
      }



      _ven.obj.addEventListener(mousedown_touchstart, bindear_(_ven.force_front, _ven), true);



      // creacion cursor
      CURSOR.crear_cursor(_ven);
      _ven.cursor_bloque = CURSOR.crear_cursor(_ven._bloque, 0);
      _ven._bloque.cursor = _ven.cursor_bloque;


      _ven.set_title(_data.titulo.titulo);
      _ven.ordenar_bloques();
      _ven.ini_$();


      if (_ven.literal == 1) {
        _ven.set_literal_size(_ven.wr, _ven.hr);
      }

      if (_ven.mobile) {
        _ven.set_x(0);
        _ven.set_y(0);
        set_viewport({
          width: _ven.wr, height: "", user_scalable: 0,
          maximum_scale: "",
          minimum_scale: "",
          initial_scale: "",
        });

      }

      if (get_type(_ven.load) == 'array') {
        _ven.load_isc(..._ven.load);
      }


      if (_data.enterframe !== undefined) {
        let _type = get_type(_data.enterframe);
        if (_type == 'number')
          crear_enterframe(_ven, _ven, function () { });

        else if (_type == 'function')
          crear_enterframe(_ven, _ven, _data.enterframe)
      }


      return (_ven);


    },



    //no se recomienda su uso
    crear_ven_yesno(f_donde, f_data, f_sub = 0) {

      let _data = setloop_prop(
        {

          x: 0,
          y: 0,
          w: 200,
          h: 200,


          titulo: { texto: "confirmar", xboton: 1 },
          texto: "Mensaje.",
          grab: 1,

          texto_yes: "Sí",
          texto_no: "No",

          yes_cerrar_onclick: 1,
          no_cerrar_onclick: 1,
          onyes() { },
          onno() { },
        },
        f_data);

      let _ven;
      if (f_sub == 0) {
        _ven = ventana.crear_ventana(f_donde, _data);
      }
      else {
        _ven = f_donde.crear_subventana(_data);

      }

      let _macro = crear_odiv(_ven._bloque, 0, 0, [5, 5], [5, 5]);
      let _texto = crear_odiv(_macro, 0, 10, [10, 10], 60, { textAlign: 'center', paddingTop: "5px", border: "none" });

      let _macroboton = crear_odiv(_macro, 0, 70, [10, 10], 65, { border: "1px solid white" });

      let _yes = crear_odiv(_macroboton, 0, 0, [0, 80], [10, 10], { textAlign: 'center', paddingTop: "10px" });
      let _no = crear_odiv(_macroboton, 0, 0, [80, 0], [10, 10], { textAlign: 'center', paddingTop: "10px" });


      _texto.obj.innerHTML = _data.texto;

      _yes.obj.innerHTML = _data.texto_yes;
      _no.obj.innerHTML = _data.texto_no;

      _yes.obj.onyes = _data.onyes;
      _no.obj.onno = _data.onno;

      _yes.obj.cerrar_onclick = _data.yes_cerrar_onclick;
      _no.obj.cerrar_onclick = _data.no_cerrar_onclick;

      _yes.obj.padreventana = _ven;
      _no.obj.padreventana = _ven;


      _yes.obj.onmousedown = function () {

        this.onyes();
        if (this.cerrar_onclick) {
          this.padreventana.cerrar();
        }
      }


      _no.obj.onmousedown = function () {

        this.onno();
        if (this.cerrar_onclick) {
          this.padreventana.cerrar();
        }

      }



      return (_ven);

    },



    //=====================
    // |botones
    //=====================

    crear_message(f_donde, fd) {
      fd = setprop_unex(fd,
        {
          modo: "yesno",
          plan: "normal",
          texto: "nada",
          titulo: "nada",
          x: 10,
          y: 10,
          w: 300,
          h: 200,

        }
      );

      var _margenborde = 30;

      let _v = ventana.crear_ventana(f_donde, { x: fd.x, y: fd.y, w: fd.w, h: fd.h, titulo: { texto: fd.titulo, xboton: 1 }, grab: 1 }, { nombre: fd.plan, macrobloque: { header: { titulo: { h: 20 } } } });

      _v.set_depth("movelast");


      if (fd.modo == "yesno") {
        let _t = crear_odiv(_v._bloque, _margenborde, _margenborde, _v._bloque.w - _margenborde * 2, _v._bloque.h - _margenborde * 2, { textAlign: "center", });
        _t.obj.innerHTML = fd.texto;
        let _marco = crear_odiv(_v._bloque, 0, 0, 1, 1);
        _marco.set_w(200);
        _marco.set_h(50);
        _marco.set_x((_v._bloque.wr / 2) - _marco.wr / 2);
        _marco.set_y((_v._bloque.hr) - _marco.hr - _margenborde);

        let _b1 = ventana.crear_boton(_marco, { nombre: "normal" }, { texto: "SI", x: 0, y: 0, w: _marco.w / 2, h: _marco.h, onmousedown: fd.on_yes, });
        let _b2 = ventana.crear_boton(_marco, { nombre: "normal" }, { texto: "NO", x: _marco.w / 2, y: 0, w: _marco.w / 2, h: _marco.h, onmousedown: fd.on_no, });
      }
      return (_v);


    },


    crear_boton(f_donde, f_plan, fd) {

      if (esundempty(f_plan)) {
        f_plan = { nombre: "normal" };
      }
      let _plantilla = ventana.plantillas[f_plan.nombre];


      if (fd.texto == undefined) {
        fd.texto = "nada!";
      }


      let __borde = _plantilla.boton.borde;
      if (typeof __borde == 'number') {
        let _s = __borde;
        __borde = [_s, _s, _s, _s];
      }

      if (esundempty(fd.w)) { fd.w = _plantilla.boton.w; }
      if (esundempty(fd.h)) { fd.h = _plantilla.boton.h; }


      let _b = crear_odiv(f_donde, fd.x, fd.y, fd.w, fd.h);
      set_style(_b.obj, _plantilla.boton.style);





      let _b_texto = crear_odiv(_b, __borde[0], __borde[1], fd.w - (__borde[0] + __borde[2]), fd.h - (__borde[1] + __borde[3]), { textAlign: 'center' });
      set_style(_b_texto.obj, _plantilla.boton.bloque_style);

      _b.botondata = fd;

      _b._padreventana = padrefind_recursivo(_b, ['_tipo', 'ventana'], 10);

      if (fd.onmousedown != undefined) {
        _b.obj.onmousedown = function (e) {
          let _BIND = _b.botondata.onmousedown.bind(_b);

          _BIND(e);
        }
      }

      _b_texto.obj.innerHTML = fd.texto;
    },




    //|scrollbar
    crear_scrollbar(f_donde, f_parametros, f_datos) {


      if (Array.isArray(f_datos) == 0) {
        let _foo = f_datos;
        f_datos = [_foo];
      }

      if (f_datos == undefined) { f_datos = [{}]; }

      //

      let _mask_odiv = f_donde;
      f_donde = crear_odiv(f_donde.padre, f_donde.x, f_donde.y, f_donde.wr, f_donde.hr, { background: 'yellow' });
      f_donde.mask_odiv = _mask_odiv;

      f_donde.obj.appendChild(_mask_odiv.obj);

      _mask_odiv.set(_mask_odiv.xr, _mask_odiv.yr, _mask_odiv.wr, _mask_odiv.hr);




      let _datos = {
        odiv: f_donde,
        _mask_odiv: f_donde.mask_odiv,

        scrollbars: [],


        margenes: [0, 0, 0, 0], //crecimiento gradual
        max_margenes: [0, 0, 0, 0],   //total

        clip_w: f_donde.wr,
        clip_h: f_donde.hr,

        max_w: 0,
        max_h: 0,


        parches: [
          crear_odiv(f_donde, 0, 0, 0, 0,),
          crear_odiv(f_donde, 0, 0, 0, 0, {}, { x_orientacion: "der" }),]
        ,

        parches_style: { background: "orange", border: 'none' },


        crear_scrollbar(f_datos) {
          let _bar =
          {
            padre: _datos,
            orientacion: ["vertical", "izq"],

            custom: "",//[0,0,0,0]
            flechas: [{ n: 20 }, { n: 20 }],

            pos_bin: 0,

            grosor: 20,


            style_macrobarra: {},
            style_barra: { background: "lightgray" },
            style_head: { background: 'blue' },

            macrobarra: "",
            _barra: "",
            _head: "",


            actualizar() {

              let _u = this;
              let _macrobarra = this.macrobarra;
              let _barra = this._barra;
              let _head = this._head;
              let _datos = this.padre;
              let _contexto = _datos.odiv;

              if (_u.orientacion[0] == "vertical") {

                if (_u.custom == "") {

                  let _ux = 0;
                  if (_u.orientacion[1] == "izq") {
                    _macrobarra.x_orientacion = _u.orientacion[1];
                    _ux = _datos.margenes[0];
                    _datos.margenes[0] += _u.grosor - 1;
                  }

                  if (_u.orientacion[1] == "der") {
                    _macrobarra.x_orientacion = _u.orientacion[1];
                    _ux = _datos.margenes[2];
                    _datos.margenes[2] += _u.grosor - 1;
                  }
                  _macrobarra.set(_ux, 0, _u.grosor, [_datos.max_margenes[1], _datos.max_margenes[3]]);
                }


                if (_u.custom != "") {
                  _macrobarra.set(_u.custom[0], _u.custom[1], _u.custom[2], _u.custom[3]);
                }

                _barra.set(0, 0, "full", [_u.flechas[0].n, _u.flechas[1].n]);
                _head.set(0, _head.yrr, "full", 0);

                //let _dif = (_contexto.hr/_datos._mask_odiv.hr);

                let _dif = (_contexto.hr / (_datos._mask_odiv.hr + _datos.max_margenes[1] + _datos.max_margenes[3])); //=1
                _head.set_h(Math.floor(_barra.hr * _dif));
              }




              if (_u.orientacion[0] == "horizontal") {

                //_macrobarra.set(0,0,"full",_u.grosor);
                if (_u.custom == "") {

                  let _uy = 0;
                  if (_u.orientacion[1] == "arr") {
                    _macrobarra.y_orientacion = _u.orientacion[1];
                    _uy = _datos.margenes[1];
                    _datos.margenes[1] += _u.grosor - 1;
                  }

                  if (_u.orientacion[1] == "aba") {
                    _macrobarra.y_orientacion = _u.orientacion[1];
                    _uy = _datos.margenes[3];
                    _datos.margenes[3] += _u.grosor - 1;
                  }
                  _macrobarra.set(0, _uy, [_datos.max_margenes[0], _datos.max_margenes[2]], _u.grosor);

                }
                if (_u.custom != "") {
                  _macrobarra.set(_u.custom[0], _u.custom[1], _u.custom[2], _u.custom[3]);
                }

                _barra.set(0, 0, [_u.flechas[0].n, _u.flechas[1].n], "full");
                _head.set(_head.xrr, 0, 0, "full");


                let _dif = (_contexto.wr / (_datos._mask_odiv.wr + _datos.max_margenes[0] + _datos.max_margenes[2])); //=1
                //alert(_barra.wr*_dif);
                _head.set_w(Math.floor(_barra.wr * _dif));
              }

            },

            mover() {

              let _barra = this._barra;
              let _head = this._head;
              if (this.orientacion[0] == "vertical") {
                if (_head.y < 0) {
                  _head.y = 0;
                  _head.update()
                }

                if (_head.y + _head.hr > _barra.hr) {
                  _head.y = _barra.hr - _head.hr;
                  _head.update()
                }

                this.pos_bin = (_head.y / (_barra.hr - _head.hr));
                if (isNaN(this.pos_bin)) {
                  this.pos_bin = 0;
                }

                //overload; ventana macro mayor a contenido
                let _over = 0;
                if (_datos.odiv.hr > _datos._mask_odiv.hr + _datos.max_margenes[1] + _datos.max_margenes[3] + 2) {
                  _over = _datos.odiv.hr - (_datos._mask_odiv.hr + _datos.max_margenes[1] + _datos.max_margenes[3] + 2);
                }

                //
                this.bin_to_max = Math.floor((_datos.max_h - _datos.odiv.h + _datos.max_margenes[1] + _datos.max_margenes[3] + 2) * this.pos_bin);
                _datos._mask_odiv.set_y(-this.bin_to_max + _datos.max_margenes[1] - _over);
              }                                                       //

              if (this.orientacion[0] == "horizontal") {
                if (_head.x < 0) {
                  _head.x = 0;
                  _head.update()
                }

                if (_head.x + _head.wr > _barra.wr) {
                  _head.x = _barra.wr - _head.wr;
                  _head.update()
                }

                this.pos_bin = (_head.x / (_barra.wr - _head.wr));
                if (isNaN(this.pos_bin)) {

                  this.pos_bin = 0;
                }


                //overload; ventana macro mayor a contenido
                let _over = 0;
                if (_datos.odiv.wr > _datos._mask_odiv.wr + _datos.max_margenes[0] + _datos.max_margenes[2] + 2) {

                  _over = _datos.odiv.wr - (_datos._mask_odiv.wr + _datos.max_margenes[0] + _datos.max_margenes[2] + 2);
                }
                this.bin_to_max = Math.floor(((_datos.max_w) - _datos.odiv.w + _datos.max_margenes[0] + _datos.max_margenes[2] + 2) * this.pos_bin);
                //              //
                _datos._mask_odiv.set_x(-this.bin_to_max + _datos.max_margenes[0] - _over);
              }


            },

          }

          setloop_prop(_bar, f_datos);
          this.scrollbars.push(_bar);


          if (_bar.orientacion[0] == "vertical" && _bar.orientacion[1] == "izq") { _datos.max_margenes[0] += (_bar.grosor - 1); }
          if (_bar.orientacion[0] == "vertical" && _bar.orientacion[1] == "der") { _datos.max_margenes[2] += (_bar.grosor - 1); }
          if (_bar.orientacion[0] == "horizontal" && _bar.orientacion[1] == "arr") { _datos.max_margenes[1] += (_bar.grosor - 1); }
          if (_bar.orientacion[0] == "horizontal" && _bar.orientacion[1] == "aba") { _datos.max_margenes[3] += (_bar.grosor - 1); }

          let _u = _bar;

          _u.macrobarra = crear_odiv(this.odiv, 0, 0, 0, 0, _u.style_macrobarra, { modo_borde: "sobrepuesto" });
          let _macrobarra = _u.macrobarra;

          _u._barra = crear_odiv(_macrobarra, 0, 0, 0, 0, _u.style_barra, { modo_borde: "sobrepuesto" });
          _u.macrobarra.barra = _u._barra;
          let _barra = _u._barra;

          _u._barra.head = crear_odiv(_u._barra, 0, 0, 0, 0, _u.style_head, { modo_borde: "sobrepuesto" });
          _u._head = _u._barra.head;
          let _head = _u._head;

          let _contexto = this.odiv;

          CURSOR.crear_grab(_head, _head, {

            onmousemove() {
              _u.mover();
            },
            onmouseup() { },
          });




        },

        actualizar() {
          this.margenes = [0, 0, 0, 0];
          for (var i in this.scrollbars) {
            let _u = this.scrollbars[i];
            _u.actualizar();
            _u.mover();
          }


          this.parches[0].set(0, 0, this.max_margenes[0], "full");
          this.parches[0].set_style(this.parches_style);
          this.parches[1].set(0, 0, this.max_margenes[2], "full");
          this.parches[1].set_style(this.parches_style);

        },


        clip(f_w, f_h, f_ini) {
          this.max_h = this._mask_odiv.hr; //hijomax
          this.max_w = this._mask_odiv.wr; //hijomax

          this.odiv.set_w(f_w);
          this.odiv.set_h(f_h);
          if (f_ini !== 1) {
            this.actualizar();
          }
        },

      }//_datos


      setloop_prop(_datos, f_parametros);
      _mask_odiv.scrollbar = _datos;
      _mask_odiv._scrollbar = _datos.odiv;

      f_donde.scrollbar = _datos;



      //clip ventana
      _datos.clip(_datos.clip_w, _datos.clip_h, 1);


      for (var i = 0; i < f_datos.length; i++) {
        let _u = f_datos[i];
        _datos.crear_scrollbar(_u);
      }


      //fix borde interno
      if (f_donde.wr == _mask_odiv.wr && _datos.max_margenes[0] == 0 && _datos.max_margenes[2] == 0) {

        _mask_odiv.obj.style.borderRightWidth = _mask_odiv.get_borde(2) + 2 + "px";
      }
      if (f_donde.hr == _mask_odiv.hr && _datos.max_margenes[1] == 0 && _datos.max_margenes[3] == 0) {

        _mask_odiv.obj.style.borderBottomWidth = _mask_odiv.get_borde(3) + 2 + "px";
      }




      _datos.actualizar();

      _datos.odiv.on_update = function (e) {
        if (e.wh == 1) {
          _datos.clip(_datos.odiv.wr, _datos.odiv.hr);

        }
      }

      _datos._mask_odiv.on_update = function (e) {
        if (e.wh == 1) {
          //_datos.clip(_datos._mask_odiv.wr, _datos._mask_odiv.hr);
        }
      }




    },


  },

  //==============


  //|menu

  MENU:
  {

    interpretar_elem(f_elem, f_this = window,  f_menuclick) {

      
      
      


      let _type = get_type(f_elem);

      if (_type == 'object')
        return ('object');

      if (_type == 'string' || _type == 'number')
      {
        setTimeout(()=>{ if(f_this.obj)f_this.obj.focus() },10 )//workaround regresar focus ventana

        alert(f_elem)
      }


      if (_type == 'function')
      {
        setTimeout(()=>{ if(f_this.obj)f_this.obj.focus() },10 ) //workaround regresar focus ventana
        bindear_(f_elem, f_this)(f_menuclick);
      }

      if (_type == 'array') //evitar cerrar al click
        return ("nothing")

      return ('no_object');

    },


    crear_racimo(f_donde, f_elem, f_data = {}, f_skin) {

      let _data =
      {
        ...{
          x: 0,
          y: 0,
          w: 100,
          h: 25,
          orientacion: 0,
        },
        ...f_data
      }
      /*
               let _jaja = crear_odiv(f_donde, 0,0,[0,0],[0,0], {overflow:'visible', border:'1px solid red',background:'none'});
                   _jaja.odiv = _jaja;
      
                   _jaja.close=function(){
      
                                    window.removeEventListener(mousedown_touchstart, this.document_mousedown, true);         
                                    this.odiv_des.remove();
      
                                    this.remove_recursivo();
                                    this.remove();
                                    
                   }
                   */

      /*
                                   padre:_data,
                                   this:_data.this, 
                                   odiv:_u,
                                   elem: _elem,
                                   nombre: inom,
                                   hijos:[],
                                   act:"",
                                   id:"",
                                   orientacion:_orien.n,
     */

      f_donde.close = function () {
        this.clicked = 0;
        window.removeEventListener(mousedown_touchstart, this.document_mousedown, true);
        this.odiv_des.remove();

        this.remove_recursivo();
        //this.remove();

      }

      f_donde.odiv = f_donde;
      MENU._crear_racimo(f_donde, {
        elem: f_elem,

        hijos: [],

        primario: 1,

        x: _data.x,
        y: _data.y,
        w: f_data.w,
        h: _data.h,
        orientacion: _data.orientacion

      }
      );



    },

    _crear_racimo(f_donde, f_data, f_skin) {


      f_data = setloop_prop(SKIN.get_menu(f_skin).racimo, f_data);


      f_donde.noloop = 1;

      f_donde.remove_recursivo = function () {
        if (this.hijos.length > 0) {
          for (var o of this.hijos) {
            o.remove_recursivo();
            o.odiv.remove();
          }
        }

        this.hijos = [];
      }


      let _data = setloop_prop(
        {
          elem: [],
          odiv_des: _root, //al recibir indefiido _root por defecto, al recibir referencia recursiva -> racimo
          x: 0,
          y: 0,
          primario: 1, //empleado en creacion listeners generales (mousedown)
          macro_padre: f_donde, //referencia compartida al craer racimo recursivo
          w: 100, //sugerencia, si anchura de html es superior, se sobrepasara(no sobrescribe esto)
          h: 100,
          margen_interno: [10, 10],
          orientacion: 0,
          style: {},
          document_mousedown(e) {
            let _inside = 0;
            let _path = e.composedPath();
            for (var u of _path) //
            {
              if (u === this.odiv_des.obj || u === this.odiv.obj) {
                _inside = 1;
                break;
              }
            }
            //console.log(_inside)

            if (_inside == 0) {
              this.close();
              //    console.log("MOUSEDOWN ELIMINADO")
            }
          },
        },
        f_data
      );


      if (_data.primario == 1) {
        //  _data.odiv_des = crear_odiv(_data.odiv_des, fl(Math.random()*40),0,10,10, {overflow:'visible'},{modo_borde:'sobrepuesto'});
        _data.odiv_des = crear_odiv(_data.odiv_des, -1, 0, 0, 0, { overflow: 'visible', }, { modo_borde: 'sobrepuesto' });

      }

      let _hmax = 0;
      let _max_html_w = _data.w;

      let _i = 0;
      for (var inom in _data.elem) {

        let _u = _data.elem[inom];

        let _type = get_type(_u);

        let _uh = _data.h;         //altura local
        let _ustyle = _data.style; //style local (necesario para personalizacion puntual $EMPTY, etc...)
        let _uhtml = '';

        //json incrustado en casilla
        if (inom.charAt(0) == "{") {
          let _ab = [0, inom.lastIndexOf("}") + 1];
          let _json = JSON.parse(inom.slice(0, _ab[1]));
          inom = inom.slice(_ab[1]);


          if (_json.modo == 'bin')//se espera {"modo":"bin", "obj":"obj_name", "var":"varname" }
          {
            /*'{"modo":"bin", "obj": "_test", "var":"bin"}Reiniciar juego'()
                                       {
                                            alert("dada")
                                       },
            */

            _ustyle = clone_object(_ustyle);

            let _obj = eval(_json.obj);
            let _var = _json.var;

            if (_obj[_var]) {

            }
            else {
              _ustyle.hover = _ustyle.normal;
              _ustyle.normal.color = "lightgray";
              _u = [];
            }

          }

        }


        if (_type == 'array') {


          if (inom.includes('$EMPTY')) {
            _uh = _u[0];
            _ustyle = clone_object(_ustyle);
            _ustyle.hover = _ustyle.normal;

            inom = ' ';
          }


          else if (inom.includes('$LINE')) {

            _uhtml = '<hr style=' + style_obj_to_tag(_ustyle.special.hr) + '>';
            _ustyle = clone_object(_ustyle);

            _uh = _ustyle.special.hr.h;

            _ustyle.hover = _ustyle.normal;


          }


          else if (inom.includes('$BIN')) {


          }

          else //array no valido
          {
            _i++;
            continue;
          }
        }


        let _foo =
        {
          padre: f_donde,
          macro_padre: _data.macro_padre, //en menu convencional, referencia a header
          //style local debido a innecesaria personalizacion
          odiv: crear_odiv(_data.odiv_des, _data.x, _data.y + _hmax, _data.w, _uh, { whiteSpace: 'nowrap' }),
          elem: _u,
          nombre: inom,
          id: _i,
          orientacion: _data.orientacion,
          margen_interno: _data.margen_interno,
          hijos: [],

          odiv_des: _data.odiv_des,

          w: _data.w, //maxima inicial, previo suma html offsetwidth
          h: _uh,

          primefin: "", //0:inicio, 1:medio,  2:fin 

          style: _ustyle,

          remove_recursivo() {
            if (this.hijos.length > 0) {
              for (var o of this.hijos) {
                o.remove_recursivo();
                o.odiv.remove();
              }
            }

            this.hijos = [];
          },

          set_style(f_style) {
            this.odiv.set_style([this.style.macro[this.primefin], f_style]);
          },
          onmousedown() {

            if (MENU.interpretar_elem(this.elem, this.macro_padre.this,  this) == 'no_object') {
              this.macro_padre.close();
            }

          },
          onmouseenter() {
            //crear racimo desde racimo
            let _type = get_type(this.elem);
            this.padre.act = this.id;
            this.set_style(this.style.hover);

            for (var u of this.padre.hijos) {
              if (u.id !== this.padre.act) {

                u.set_style(u.style.normal);
                u.remove_recursivo();

              }
            }

            if (_type == 'object') {
              let _global = this.odiv.get_global();

              if (this.hijos.length == 0) {

                if (this.orientacion == 0) {
                  MENU._crear_racimo(this, {
                    elem: this.elem, x: _global.x + this.odiv.wr - 1, y: _global.y - 1, w: this.w, h: this.h,
                    orientacion: this.orientacion, primario: 0, macro_padre: this.macro_padre, odiv_des: this.odiv_des, style: this.style
                  });
                }

                if (this.orientacion == 1) {

                  _w = this.w; //anchura maxima inicial; originaria; previo aumento via html_maxwidth

                  let _elem_max_w = get_html_maxwidth(this.elem, this.margen_interno[0] + this.margen_interno[1]);

                  if (_elem_max_w > _w)
                    _w = _elem_max_w;

                  MENU._crear_racimo(this, {
                    elem: this.elem, x: _global.x - _w + 1, y: _global.y - 1, w: this.w, h: this.h,
                    orientacion: this.orientacion, primario: 0, macro_padre: this.macro_padre, odiv_des: this.odiv_des, style: this.style
                  });
                }

              }
            }


          },
          onmouseleave() {
            if (this.hijos.length == 0) {
              this.set_style(this.style.normal);
            }
          },
        }



        let _odiv = _foo.odiv;
        _odiv.set_html_maxwidth(inom, _data.margen_interno[0] + _data.margen_interno[1]);


        if (_uhtml !== "") //TODO: mejorar ; tosco
        {
          _odiv.obj.innerHTML = _uhtml;
        }
        else {
          _odiv.obj.style.paddingLeft = _data.margen_interno[0] + 'px';

        }


        //definicion primefin
        if (_i == 0) _foo.primefin = 0;
        if (_i > 0) _foo.primefin = 1;
        if (_i == Object.keys(_data.elem).length - 1) _foo.primefin = 2;

        _foo.set_style(_ustyle.normal);


        if (_odiv.wr > _max_html_w)
          _max_html_w = _odiv.wr;

        _hmax += _uh;

        f_donde.hijos.push(_foo);


        _odiv.obj[onmousedown_ontouchstart] = bindear_(_foo.onmousedown, _foo);
        _odiv.obj.onmouseenter = bindear_(_foo.onmouseenter, _foo);
        _odiv.obj.onmouseleave = bindear_(_foo.onmouseleave, _foo);



        _i++;
      }

      for (var u of f_donde.hijos) {
        u.odiv.set_w(_max_html_w);
      }


      f_donde.document_mousedown = bindear_(_data.document_mousedown, f_donde);
      f_donde.odiv_des = _data.odiv_des;

      if (_data.primario == 1) {
        //   console.log("MOUSEDOWN CREADO")

        window.addEventListener(mousedown_touchstart, f_donde.document_mousedown, true)

      }


    }, //crear racimo


    //undefined = default = parametro 'default' 
    crear_menu(f_donde, f_elem, f_data, f_skin) {


      f_data = setloop_prop(SKIN.get_menu(f_skin), f_data);


      //barra
      let _data = setloop_prop(
        {

          //barra
          w: [0, 0],
          h: 25,

          odiv: "",
          elem: "",

          hijos: [],

          act: "",

          this: f_donde,

          style: { background: 'white', border: '1px solid white', borderBottom: '2px solid black' }, //barra


          racimo:
          {
            style:
            {

              normal: {},
              hover: {},
              click: {},
              special:
              {
                hr: {}
              }
            }

          },

          header: //boton header
          {
            //x w_add  //y padding
            margen_interno: [5, 5, '50%'],
            margen_externo: [0, 0], //|_[], | []_[]_[]
            h: [0, 0],

            style:
            {
              macro: { border: '1px solid white', background: 'white' },

              normal: { background: 'white' },
              hover: { background: 'lightgray', border: '1px solid lightgray' },
              click: { background: 'gray', border: '1px solid gray' },

            },

            remove_headers() {
              for (var u of _data.hijos) {
                u.odiv.remove();
              }
              _data.hijos = [];

            },

            ini_headers() {

              let _lastmax_w = [0, 0]; //->, <-$

              //izq, der, total
              let i = [0, 0, 0];
              for (var inom in _data.elem) {

                let _orien = { n: 0, string: 'izq' }

                let _elem = _data.elem[inom];
                let _i = 0;
                if (inom.charAt(0) == "$") {
                  _i = 1;
                  inom = inom.slice(1);
                  _orien = { n: 1, string: 'der' }
                }



                let _u = crear_odiv(_data.odiv, _lastmax_w[_orien.n] + _data.header.margen_externo[1] + _data.header.margen_externo[0] - (1 * i[_i]), 0,
                  100, _data.header.h, {}, { modo_borde: 'sobrepuesto', }
                );

                _u.x_orientacion = _orien.string;
                _u.set_html_maxwidth(inom, _data.header.margen_interno[0] + _data.header.margen_interno[1]);

                _u.obj.style.paddingLeft = _data.header.margen_interno[0] + 'px';


                let _margen_interno_2 = _data.header.margen_interno[2];


                if (get_type(_margen_interno_2) == 'string' && _margen_interno_2.charAt(_margen_interno_2.length - 1) == '%') {                                                 //25 = altura renglon
                  _u.obj.style.paddingTop = fl(get_percentage(_data.h, _margen_interno_2)) - 12 + 'px';
                  //-25
                }
                else {
                  _u.obj.style.paddingTop = _margen_interno_2 + 'px';
                }


                _lastmax_w[_orien.n] += _u.wr;

                _u.obj.innerHTML = inom;

                let _h =
                {
                  __info:
                  {
                    padre: '_data, _barra',
                    elem: 'contenido header',
                  },
                  padre: _data,
                  this: _data.this,
                  odiv: _u,
                  elem: _elem,
                  nombre: inom,
                  hijos: [],
                  act: "",
                  id: "",
                  orientacion: _orien.n,
                  close() {
                    window.removeEventListener(mousedown_touchstart, this.document_mousedown, true);
                    this.odiv_des.remove();

                    this.remove_recursivo();
                    this.padre.act = "";
                    this.odiv.set_style([this.style.macro, this.style.normal]);


                  },
                  onmousedown(e) {

                    let _global = this.odiv.get_global();
                    if (this.padre.act !== this.id) {




                      if (MENU.interpretar_elem(this.elem, this.this, this) == 'object') {
                        this.odiv.set_style([this.style.macro, this.style.click]);


                        let _x = _global.x;
                        if (this.orientacion == 1) {
                          _x = 100;
                          let _htmlw = get_html_maxwidth(this.elem, 20);
                          if (_htmlw > 100) {
                            _x = _htmlw;
                          }

                          _x = _global.x - _x + this.odiv.wr;


                        }

                        MENU._crear_racimo(this, setloop_prop(
                          {                     //pre fix quirks this.odiv.hr-1
                            elem: this.elem, x: _x, y: _global.y + this.odiv.hr - 2, w: 100, h: 25, orientacion: this.orientacion,
                          }, this.padre.racimo));

                        this.padre.act = this.id;

                      }
                    }



                    else {

                      this.close();
                    }

                  },
                  onmouseup(e) {

                  },
                  onmouseenter(e) {
                    if (this.padre.act !== this.id) {
                      this.odiv.set_style([this.style.macro, this.style.hover]);
                      if (this.padre.act !== "") {

                        if (get_type(this.elem) == 'object') {
                          this.padre.hijos[this.padre.act].close();
                          this.onmousedown(e);

                        }

                      }
                    }
                  },
                  onmouseleave(e) {
                    if (this.padre.act !== this.id) {
                      this.odiv.set_style([this.style.macro, this.style.normal]);
                    }
                  },
                  style: _data.header.style,
                };

                _h.id = i[2]; //i total; no izq o der

                _u.set_style([this.style.macro, this.style.normal]);
                _u.obj[onmousedown_ontouchstart] = bindear_(_h.onmousedown, _h);
                _u.obj[onmouseup_ontouchend] = bindear_(_h.onmouseup, _h);
                _u.obj.onmouseenter = bindear_(_h.onmouseenter, _h);
                _u.obj.onmouseleave = bindear_(_h.onmouseleave, _h);
                _data.hijos.push(_h)

                i[_i]++;
                i[2]++;
              }//end inom in _data.elem


            },


          },//end header


        },//end _data

        f_data);





      f_donde.cuadrar_hijos = 1;
      _data.odiv = crear_odiv(f_donde, 0, 0, _data.w, _data.h, _data.style, { cuadrar_hijos: 1, modo_borde: 'interno' });
      _data.elem = f_elem;

      _data.header.ini_headers();



      return (_data)

    }//crear_menu

  }, //MENU




  //=============================
  //  |slideshow
  //=============================

  SLIDESHOW:
  {

    efectos:
    {

      blink:
      {
        background: 'lightgray',

        tt: 0,
        tt_max: 30,

        ll: 0,
        ll_max: 5, //personalizar este; cantidad de iteraciones

        z_index: 100,

        load(e) {
          e.odiv_efecto = crear_odiv(e.odiv_afectado, 0, 0, [0, 0], [0, 0], { border: 'none', background: this.background, opacity: 1, zIndex: this.z_index });

        },

        enterframe(e) {
          this.tt++;
          if (this.tt == this.tt_max) {
            e.odiv_efecto.set_opacity(0);
            this.ll++;
          }

          if (this.tt == this.tt_max * 2) {
            this.tt = 0;

            e.odiv_efecto.set_opacity(1);
          }

          if (this.ll >= this.ll_max) {
            return (1);
          }

        },

      },


      in:
      {

        background: 'black',
        speed: 0.01,
        w: 'full',
        h: 'full',
        load(e) {

          e.odiv_efecto = crear_odiv(e.odiv_afectado, 0, 0, this.w, this.h, { background: this.background, opacity: 0, zIndex: 100 });
        },
        enterframe(e) {
          e.odiv_efecto.set_opacity(e.odiv_efecto.opacity + this.speed);

          if (e.odiv_efecto.opacity >= 1) {

            return (1);
          }

        },
      },


      out:
      {
        background: 'black',
        speed: 0.01,
        w: 'full',
        h: 'full',
        // del_odiv:1,
        load(e) {

          e.odiv_efecto = crear_odiv(e.odiv_afectado, 0, 0, this.w, this.h, { background: this.background, opacity: 1, zIndex: 100 });
        },
        enterframe(e) {
          e.odiv_efecto.set_opacity(e.odiv_efecto.opacity - this.speed);
          // e.odiv_efecto=crear_odiv(e.odiv_afectado, 10,10,10,10);
          if (e.odiv_efecto.opacity <= 0) {

            return (1);
          }

        },
      },

    },


    ini: 0,
    hijos: [],



    _main() {

      for (var i = 0; i < this.hijos.length; i++) {
        let _u = this.hijos[i];
        _u.enterframe();
      }

    },


    crear_manager(f_odiv, f_data,) {

      //let _copia_efecto = clone_array(this.plantillas[fp_datos.nombre]);

      //setloop_prop(_copia_efecto, fp_datos);//a plantilla generica, aplicar datos diferenciales entrantes



      let _new_hijo = {

        odiv_afectado: f_odiv,

        data: f_data,
        act: 0,
        tt: 0,
        odiv_efecto: "",
        id: SLIDESHOW.hijos.length,

        copia_efecto: "",
        _del_odiv_efect() //odiv efecto
        {
          // let _get = this.data[this.act];
          // if(SLIDESHOW.efectos[_get].del_odiv==1)
          //  {
          if (this.odiv_efecto != "") {
            this.odiv_efecto.remove();
            this.odiv_efecto = "";
          }
          //  }
        },

        enterframe() {
          let _get = this.data[this.act];


          var _a;

          if (this.tt == 0) {
            if (typeof _get == 'string') {
              this.copia_efecto = clone_array(SLIDESHOW.efectos[_get]);
            }
            if (typeof _get == 'object') {

              let _str = _get.nombre;
              this.copia_efecto = clone_array(SLIDESHOW.efectos[_str]);
              setloop_prop(this.copia_efecto, _get);//a plantilla generica, aplicar datos diferenciales entrantes


              this.data[this.act] = _str;

              _get = _str;


            }

          }


          if (typeof _get == 'string') {
            if (this.tt == 0) {

              this._del_odiv_efect();
              // _a = SLIDESHOW.efectos[_get].load(this);              
              _a = this.copia_efecto.load(this);
            }
            else {
              //  _a = SLIDESHOW.efectos[_get].enterframe(this);  
              _a = this.copia_efecto.enterframe(this);
            }
            this.tt++;
          }
          if (typeof _get == 'function') {

            _get();
            _a = 1
          }

          if (_a == 1) {


            this.act++;
            this.tt = 0;

            this._del_odiv_efect();
            //si [][][] han terminado
            if (this.act > this.data.length - 1) {
              this.remove();
            }
            this.enterframe();
          }


        },

        remove() {
          // alert("chaolin!");
          for (var i in SLIDESHOW.hijos) {
            if (SLIDESHOW.hijos[i].id > this.id) {
              SLIDESHOW.hijos[i].id--;
            }
          }
          SLIDESHOW.hijos.splice(this.id, 1);
          if (SLIDESHOW.hijos.length == 0) {
            SLIDESHOW.MASTER_END();
            SLIDESHOW.ini = 0;
          }
        },

      };

      this.hijos.push(_new_hijo);
      return (_new_hijo);
    },


    crear_slideshow(f_odiv, f_data, f_func) {
      let _r = this.crear_manager(f_odiv, f_data)
      if (this.ini == 0) {
        this.ini = 1;
        crear_enterframe(SLIDESHOW, SLIDESHOW, this._main);
      }

      return (_r);
    },
    MASTER_END() {
      this.KILL_ENTERFRAME = 1;
    },


  }, //end slideshow


  //==================
  //       |FORM
  //==================
  FORM:
  {

    crear_toolbar(f_donde, f_data) {

      var _toolbar = setloop_prop(
        {
          padre: f_donde,
          hijos: [],

          s: 30,   //short
          l: [0, 0],//long
          orientacion: 'vertical',
          odiv: "",  //odiv barra
          style: {},//style odiv barra
          props: {},//propiedades a odiv barra

          grupos: {
            add(f_boton) {

              if (this[f_boton.group.id] == undefined)
                this[f_boton.group.id] = [];
              this[f_boton.group.id].push(f_boton)

            },


          },

          margen_l: [10, 10],//inicio, entre boton
          margen_s: 5,

          eventos: //macro eventos
          {
            mousedown(e) { }, //llamado via _mousedown()

            _mousedown(e)//no editar; this = boton
            {

              let _padre = this.padre;
              if (this.group.unhold) {
                // console.log(this.group.unhold)
                for (var u of _padre.hijos) {
                  if (u !== this && u.group.id == this.group.id && u.estado == 1) {

                    let _a = u.mousedown[0]; //desacticar maro temporalmente
                    u.mousedown[0] = function () { };

                    u.update(0, 1);
                    u.mousedown[0] = _a;
                  }
                }

              }

              bindear_(this.padre.eventos.mousedown, this)(e);

            },
          },

          p_icono: { //plantilla
            w: 20,
            h: 20,
            style: [{ background: 'lightgray' }, { background: 'white' }],//presionado; suelto

            hold: "",
            block_uncheck: 0,

            key: "",//['z', win.teclado],

            mousedown(_bin) { },

            group:
            {
              id: 0,
              unhold: 1,
            }

          },
          iconos: [

            { mousedown(e) { } },
            {},
            {},
            {}

          ],


          ini() {
            let _a;
            let _b;
            if (this.orientacion == 'horizontal') {
              _a = this.l;
              _b = this.s;
            }
            if (this.orientacion == 'vertical') {
              _a = this.s;
              _b = this.l;
            }

            this.odiv = crear_odiv(this.padre, 0, 0, _a, _b, this.style, this.props);
            this.crear_iconos();

          },//ini

          crear_iconos() {

            let i = 0;
            for (var u of this.iconos) {

              let _a;
              let _b;

              if (this.orientacion == 'horizontal') {
                _a = this.margen_l[0] + ((20 + this.margen_l[1]) * i);
                _b = this.margen_s;
              }

              if (this.orientacion == 'vertical') {
                _a = this.margen_s;
                _b = this.margen_l[0] + ((20 + this.margen_l[1]) * i);

              }



              let _data = setloop_prop(
                {
                  ...clone_object(this.p_icono), //fix bug; ... crea referencias debiles ?

                  ...{
                    padre: _toolbar,
                    x: _a,
                    y: _b,
                    _ID: i,
                  },
                },

                u

              );

              _data.mousedown = array_from_no_undefined(_toolbar.eventos._mousedown,
                _data.mousedown);



              let _boton = FORM.crear_boton(this.odiv, _data);
              _toolbar.hijos.push(_boton);

              _toolbar.grupos.add(_boton);


              i++;
            }//loop iconos



          },//crear iconos



        },
        f_data
      )

      _toolbar.ini();

      return (_toolbar);

    },//crear_toolbar



    //|crear_boton simple, no teclado visual
    crear_boton(f_donde, f_data) {



      let _data = setloop_prop(
        {
          _padre: f_donde,

          dispatch_on_create: 1, //lanzar eventos al crear

          x: 0,
          y: 0,
          w: 20,
          h: 20,
          altura: [-3, -1], //no presionado; presionado 

          block_uncheck: 0, //evitar deseleccionar via mousedown (puede desactivarse externamente; solo hold 0,1)

          hold: "", //"" -> no mantener; 0 -> iniciar libre; 1->iniciar presionado
          key: ['', ''], //key, modulo 
          var: ["", ""], //[objeto, prop] -> 0,1
          url: ["", ""],
          mousedown(e, _boton) { }, // e = estado actualizado


          style: [
            {},                               //macro
            {},                               //libre
            {},                               //presionado

          ],



          estado: "", //0,1; no tocar
          img_odiv: ['', ''], //odivs con imagenes creados en ini; no tocar



          update(f_n, _force = 0, f_dispatch = 1) {

            if (this.block_uncheck == 1 && this.estado == 1 && _force == 0)
              return;

            this.estado = f_n;

            let _head = this.head;
            let _base = this.base;

            _head.set_y(this.altura[f_n])

            _head.set_style(this.style[0])
            _head.set_style(this.style[f_n + 1])

            //ocultar;mostrar imagenes
            if (this.img_odiv[flipbin(f_n)] !== "")
              this.img_odiv[flipbin(f_n)].obj_img.style.visibility = 'hidden';

            if (this.img_odiv[f_n] !== "")
              this.img_odiv[f_n].obj_img.style.visibility = 'visible';


            //update var
            if (this.var[0] !== "")
              this.var[0][this.var[1]] = f_n;


            if (f_dispatch) {

              let _mousedown = this.mousedown;

              if (get_type(this.mousedown) !== 'array')
                _mousedown = [_mousedown];

              for (var u of _mousedown)
                bindear_(u, this)(f_n, this);
            }

          },

          tipo: 'externo', //interno, externo
          ini() {
            let _tipostyle = { overflow: 'visible' };
            if (this.tipo == 'interno')
              _tipostyle = { overflow: 'hidden' };

            let _base = this.base = crear_odiv(this._padre, this.x, this.y, this.w, this.h, _tipostyle);
            let _head = this.head = crear_odiv(_base, 0, 0, this.w, this.h, {}, { modo_borde: 'sobrepuesto' });


            if (get_type(this.url) == 'array' && this.url.length == 1)
              this.url = [this.url[0], this.url[0]];
            for (var i in this.url) {
              if (this.url[i] !== "")

                this.img_odiv[i] = crear_odiv_image_(_head, { x: -2, y: -2, w: this.w, h: this.h, url: this.url[i], style: { background: 'none' } });
            }
            this.base.obj.onmousedown = bindear_(this._mousedown, this);

            //hotkey via key['key','modulo']
            if (this.key !== "" && this.key[0] !== "") {
              let _modulo = this.key[1];
              _modulo.onkeydown = pushconvert_in_arr(_modulo.onkeydown, bindear_(function (e, _prev) {

                if (e.key.toLowerCase() == this.key[0].toLowerCase() && _prev == 0) {
                  if (this.hold === "")
                    this.update(1);

                  else
                    this.update(flipbin(this.estado));
                }

              }, this)
              )


              if (_root.teclado == undefined)
                TECLADO.crear_teclado(_root);

              _root.teclado.onkeyup = pushconvert_in_arr(_root.teclado.onkeyup, bindear_(function (e) {
                if (e.key.toLowerCase() == this.key[0].toLowerCase()) {
                  if (this.hold === "")
                    this.update(0);
                }

              }, this)
              )




            }

            if (this.dispatch_on_create) {
              if (this.hold === "")
                this.update(0);
              else
                this.update(this.hold);
            }



          },


          _mousedown(e) {

            if (this.hold === "") {
              this.update(1);
              window.addEventListener('mouseup', this._mouseup);
            }

            else {

              if (this.estado == 0 || this.estado == 1 && this.block_uncheck == 0)
                this.update(flipbin(this.estado));


            }


          },

          _mouseup(e) //solo disparado al hold==""
          {
            _data.update(0);
            window.removeEventListener('mouseup', _data._mouseup);
          },


        },
        f_data
      );



      _data.ini();

      return (_data);

    },



    crear_textarea_titulado_horizontal(f_donde, f_data) {
      //     |    [      ] [     ]    |
      //        |    |    |   |    |
      let _x = [0, 10, 100, -1, 100, 10];
      // |     
      //macro
      // |
      let _y = [0, 10, 30, 10];


      if (f_data.w !== undefined) {
        _x[2] = f_data.w[0];
        _x[4] = f_data.w[1];
      }

      if (f_data.h !== undefined) {
        _y[2] = f_data.h;
      }


      if (f_data.x_margen !== undefined) {
        _x[1] = f_data.x_margen[0];
        _x[3] = f_data.x_margen[1];
        _x[5] = f_data.x_margen[2];
      }

      if (f_data.y_margen !== undefined) {
        _y[1] = f_data.y_margen[0];
        _y[3] = f_data.y_margen[1];
      }


      //xmacro
      if (f_data.xm !== undefined)
        _x[0] = f_data.xm;
      //ymacro
      if (f_data.ym !== undefined)
        _y[0] = f_data.ym;



      let _data = setloop_prop({

        x: _x,

        y: _y,

        texto: '',
        max_char: 10,
        valor: '', //texto input

        macro: {

          onWrite(e) { },

        },


      },

        f_data);






      _text = FORM.crear_textarea_titulado(f_donde,
        {
          macro:
            setloop_prop(
              {
                x: _data.x[0],
                y: _data.y[0],

                w: _data.x[1] + _data.x[2] + _data.x[3] + _data.x[4] + _data.x[5],
                h: _data.y[1] + _data.y[2] + _data.y[3],

                style: _data.macro_style,

              },
              _data.macro
            ),

          titulo: {
            x: _data.x[1],
            y: _data.y[1],
            w: _data.x[2],
            h: _data.y[2],
            texto: _data.texto,
            style: _data.titulo_style,
          },

          textarea: {
            x: _data.x[1] + _data.x[2] + _data.x[3],
            y: _data.y[1],
            w: _data.x[4],
            h: _data.y[2],
            style: _data.text_style,

            max_char: _data.max_char,
            valor: _data.valor,
          }

        }
      );




      return (_text);




    },


    crear_textarea_titulado_simple(f_donde, f_data) {

      let _data = setloop_prop({
        x: 0,
        y: 0,
        w: 100,
        h: 200,
        max_char: 5,
        y_texto: 0,
        x_texto: 0,
        texto: "titulo",
        valor: "",
        margen_y: 20,
        margen_x: 10,

      },

        f_data);


      let _margen_x = _data.margen_x;
      let _margen_y = _data.margen_y;

      _text = FORM.crear_textarea_titulado(f_donde,
        {
          macro: {
            x: _data.x,
            y: _data.y,
            w: _data.w,
            h: _data.h,

          },
          titulo: {
            x: _margen_x + _data.x_texto,
            y: _data.y_texto,
            w: _data.w - _margen_x * 2,
            h: _data.margen_y,
            texto: _data.texto,
          },
          textarea: {
            x: _margen_x,
            y: _data.margen_y,
            w: _data.w - _margen_x * 2,
            h: _data.h - _data.margen_y * 2,
            max_char: _data.max_char,
            valor: _data.valor,
          }

        }
      );


      return (_text);

    },

    crear_textarea_titulado(f_donde, f_data = {}) {



      let _dmacro = setloop_prop({
        x: 0, y: 0, w: 100, h: 100,
        style: {}
      },
        f_data.macro);

      let _dtitulo = setloop_prop({ x: 0, y: 0, w: 0, h: 0, texto: "foo", style: { border: '1px solid black' } }, f_data.titulo);
      let _dtext = setloop_prop({ x: 0, y: 0, w: 100, h: 100, valor: "", max_char: 5, style: {} }, f_data.textarea);




      let _omacro = crear_odiv(f_donde, _dmacro.x, _dmacro.y, _dmacro.w, _dmacro.h, _dmacro.style, _dmacro);


      var _otitulo = crear_odiv(_omacro, _dtitulo.x, _dtitulo.y, _dtitulo.w, _dtitulo.h, _dtitulo.style)
      _omacro.otitulo = _otitulo;
      _otitulo.obj.innerHTML = _dtitulo.texto;

      var _otext = FORMS.crear_textarea(_omacro, _dtext.x, _dtext.y, _dtext.w, _dtext.h, _dtext.style);
      _omacro.otext = _otext;
      _otext.obj.maxLength = _dtext.max_char;

      _otext.obj.value = _dtext.valor;
      _omacro.valor = _dtext.valor; //atajo


      _omacro.set_text = function (f_string) {
        _omacro.otext.obj.value = f_string;

      }

      _otext.obj.onpaste = function (e) {
        e.preventDefault();
      }
      _otext.obj.onkeydown = function (e) {

        if (e.key == "Enter") {
          if (_otext.padre.onenter !== undefined)
            _otext.padre.onenter();
          e.preventDefault();
        }

      }

      _otext.obj.onkeyup = function () {
        _otext.padre.valor = _otext.obj.value;

        if (_otext.padre.onWrite !== undefined)
          _otext.padre.onWrite(_otext.obj.value);


      }

      return (_omacro);

    },

    //uso recomendado
    // FORM.crear_textarea(_a,{titulo:"jaja", value:"jaja", y:100, centro:100, onwrite(){}  })
    //|crear_textarea
    crear_textarea(f_donde, f_data) {


      let _data = setloop_prop(
        {
          orientacion: 'horizontal',
          titulo: "titulo",
          value: "",

          can_paste:0,
          w: [0, 0],
          h: 20,
          y: 0,
          centro: "", //macro.w/2

          macro_style: { overflow: 'visible' },
          titulo_style: { border: 'none'},
          input_style: {},
          multiline:0,
          max_char: 10,

          modo_borde: 'sobrepuesto',
          onenter_by_key:1,
          onwrite() { },
          onenter() { },
        },
        f_data
      )


      let _macro = crear_odiv(f_donde, 0, _data.y, _data.w, _data.h, _data.macro_style, _data);

      if (_data.centro === "")
        _data.centro = _macro.wr / 2;


      let _titulo = crear_odiv(_macro, 0, 0, _data.centro, [0, 0], _data.titulo_style, { modo_borde: 'sobrepuesto' });
      _macro.titulo = _titulo;
      _macro.padre = _titulo;

      _titulo.obj.innerHTML = _data.titulo;
                                                                                                   //-5 = compensar quirk mode
      let _input = FORMS.crear_textarea(_macro, _data.centro, -1,   _macro.wr - _data.centro, _data.h-5);
      _macro.input = _input;
      _input.padre = _macro;

      //_input.obj.maxLength = _data.max_char;
      _input.obj.value = _data.value;


      _macro.set_titulo = function (f_string) {
        _macro.titulo.obj.innerHTML = f_string;
      }
      _macro.get_titulo = function () {
        return (_macro.titulo.obj.innerHTML)
      }

      _macro.set_value = function (f_string) {
        if(get_type(f_string)=='array')
        {
          let _str = "";
          for(var i =0; i< f_string.length;i++)
          {
               let u = f_string[i];
               if(get_type(u)!=='object')
                _str += u;
               else
                _str += JSON.stringify(u);


               if(i<f_string.length-1)
               _str += ',';
          }

          f_string = _str;
          
        }
        _macro.input.obj.value = f_string;
      }

      _macro.get_value = function () {
        return (_macro.input.obj.value);
      }

      if(_data.can_paste==0)
      {
      _input.obj.onpaste = function (e) {
        e.preventDefault();
      }
      }
      _input.obj.onkeydown = function (e) {

        if (e.key == "Enter") {
          if (_input.padre.onenter !== undefined && _input.padre.onenter_by_key)
            _input.padre.onenter();

           if(_input.padre.multiline==0)
          e.preventDefault();
        }

      }

      _input.obj.onblur = function () {
        if (_input.padre.onenter !== undefined)
          _input.padre.onenter();

      }

      _input.obj.onkeyup = function () {

        if (_input.padre.onwrite !== undefined)
          _input.padre.onwrite(_input.obj.value);

      }



      return (_macro)


    },



    obj_to_input(f_des, f_obj, f_data) {

      let _data = setloop_prop(
        {
          x: 0,
          y: 0,
          w: [0, 0],
          h: [0, 0],

        },
        f_data
      )

      let _macro = crear_odiv(f_des, _data.x, _data.y, _data.w, _data.h);

      let i = 0;
      for (var u in f_obj) {
        let _v = f_obj[u];
        FORM.crear_textarea_titulado_horizontal(_macro, {
          ym: i * 40,
          y_margen: [2, 2],
          texto: u, max_char: 100,
          valor: _v,

          macro:
          {
            obj_padre: [f_obj, u],
            onWrite(e) {
              this.obj_padre[0][this.obj_padre[1]] = this.valor;

            },
          }

        })

        i++;
      }


    },



  },//end form



  //|debug
  DEBUG:
  {
    crear_tile_editor(f_donde, f_data) {

      f_data.offset_obj.setloop_direct = 1;


      let _data = setloop_prop(
        {
          uid: fl(Math.random()*100),
          padre: f_donde,

          x: 0,
          y: 0,
          w: 360,
          h: 400,

          tw: 16,
          th: 16,

          minimap_scale: 1,
          capa_n: 1,

          estado: 1, //1=funcional; 0=pausado
          estado_tiledraw: 1, //1 = dibujar en odiv destino; 0 =pausado
          key:
          {
            capas: ['|', '1', '2'],
            erase: ['lshift', 0], //tecla, indice tile vacio
            drop: 'space',

            add: [['space','a'], ['space','w'], ['space','d'], ['space','s'] ],
            rem: [['lshift', 'a'], ['lshift', 'w'], ['lshift', 'd'], ['lshift', 's']],

            onkeydown(e) {},
            onkeyup(e)   {},
          },//key


          images: '', //<------- //[]
          offset_obj: "", //empleado al pintar tiles
          odiv_des: "",
          cursor_des: "",
          tileges: "",  //<-------
          
          cursor: '', //[]
          
          win: '',
          odiv_image: '',
          teclado: '',
          r_teclado:'', //root_teclado

          modo:0, //tile, objectos

          //|tileprop (editor)
          tileprop:
          {
            _padre: "",
            odiv: "",
            x: 190,
            y: 10,
            w: 150,
            h: 100,
            forms:
            {
              col: "",
            },
            ini() {

               //modo objetos
              if(this._padre.modo==1)
              {

              let _odiv = this.odiv = crear_odiv(this._padre.win._bloque, this.x, this.y, this.w, 300)
              this.forms.id    = FORM.crear_textarea(_odiv, { titulo: "ID", centro:60, value: "", titulo_style:{paddingLeft:'4px'}, y: 0, h:21, onwrite() { }, onenter() { } })
              this.forms.name  = FORM.crear_textarea(_odiv, { titulo: "Name" , centro:60, value: "", titulo_style:{paddingLeft:'4px'}, y: 20,h:21, onwrite() { }, onenter() { } })
              this.forms.json  = FORM.crear_textarea(_odiv, { 
                                                             titulo: "" ,
                                                             centro:0,
                                                             value: "",
                                                             multiline:1,
                                                             titulo_style:{paddingLeft:'4px'},
                                                             can_paste:1,
                                                             y: 40,h:300,
                                                             onwrite() { },
                                                             onenter_by_key:0,

                                                             onenter: bindear_(function () 
                                                            {
                                                           // let _tiledata = this._padre.tileges.tiledata;
                                                            
                                                                this._padre.objcon.update_props_select();

                                                            }, this)

                                                             })
              }



              //modo tiles
              if(this._padre.modo==0)
              {
              let _odiv = this.odiv = crear_odiv(this._padre.win._bloque, this.x, this.y, this.w, this.h)

              this.forms.id = FORM.crear_textarea(_odiv, { titulo: "ID", centro:60, value: "", titulo_style:{paddingLeft:'4px'}, y: 0, h:21, onwrite() { }, onenter() { } })
              this.forms.x  = FORM.crear_textarea(_odiv, { titulo: "X" , centro:60, value: "", titulo_style:{paddingLeft:'4px'}, y: 20,h:21, onwrite() { }, onenter() { } })
              this.forms.y  = FORM.crear_textarea(_odiv, { titulo: "Y" , centro:60, value: "", titulo_style:{paddingLeft:'4px'}, y: 40,h:21, onwrite() { }, onenter() { } })
              this.forms.col = FORM.crear_textarea(_odiv, {
                                                            titulo: "Col", 
                                                            value: "", 
                                                            centro:60,
                                                            y: 60, 
                                                            h:21,
                                                            titulo_style:{paddingLeft:'4px'}, 
                                                            onwrite() { },
                                                            onenter: bindear_(function () 
                                                            {
                                                            let _tiledata = this._padre.tileges.tiledata;
                                                            
                                                                                      //, que no este dentro de {}
                                                          let _value = 
                                                          this.forms.col.get_value().split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)(?![^{]*\})/gm);
                                                            
                                                           // console.log(_value);

                                                            

                                                              for (var i = 0; i < _value.length; i++) 
                                                              {
                                                                if(is_numeric(_value[i]))
                                                                    _value[i] = +_value[i];  
                                                                else if(_value[i].charAt(0)=='{')
                                                                {
                                                                    _value[i]=JSON.parse(_value[i]);
                                                                 //   console.log(_value[i]);
                                                                }
                                                              }

                                                              
                                                               let _id = this._padre.selector.id;

                                                               _tiledata.col[_id] = _value;
                                                               //console.log(_tiledata.col[_id]);

                                                            }, this)

                                                        })


              this.forms.anim = FORM.crear_textarea(_odiv, {
                                                        titulo: "Anim",
                                                        value: "",
                                                        centro:60,
                                                        y: 80,
                                                        h:21,
                                                        titulo_style:{paddingLeft:'4px'}, 
                                                        max_char: 15,
                                                        onwrite() { },
                                                        onenter: bindear_(function () 
                                                        {
                                                        let _tiledata = this._padre.tileges.tiledata;
                                                        let _value = this.forms.anim.get_value().split(",");

                                                          for (var i = 0; i < _value.length; i++) {
                                                            if (_value[i] !== "")
                                                              _value[i] = +_value[i];
                                                          }

                                                          let _id = this._padre.selector.id;

                                                          _tiledata.anim[_id] = _value;

                                                        }, this)

                                                       })

              }


            },
            set() {
              let _tiledata = this._padre.tileges.tiledata;
              this.forms.id?.set_value(this._padre.selector.id)
              this.forms.x?.set_value(this._padre.selector.xt)
              this.forms.y?.set_value(this._padre.selector.yt)
              this.forms.col?.set_value(_tiledata.col[this._padre.selector.id])
              this.forms.anim?.set_value(_tiledata.anim[this._padre.selector.id])

              
              if(this._padre.objcon.act)
              {
              this.forms.name?.set_value(this._padre.objcon.act.id);  
              this.forms.json?.set_value(this._padre.objcon.act.json);  
              }
              
              else
              {
              this.forms.name?.set_value('');  
              this.forms.json?.set_value('');  
              }
              

            },
          },//tileprop

          //|selector
          selector:
          {
            _padre: "",
            id: 0,
            x: 0,
            y: 0,
            xt: 0,//tile
            yt: 0,//tile

            odiv: "",
            set(f_x, f_y) {

             this._padre.objcon.select = '';

             let _padre = this._padre;

             let _odiv = this.odiv;
             if(_odiv==='')
             _odiv = this.odiv = crear_odiv(_padre.odiv_image, 0, 0, _padre.tw, _padre.th, { background: 'none', border: '1px solid red' })
            
              //console.log(this._padre.win.escenario.frame[])

             bindear_(this._padre.escenario.frames[this._padre.escenario.current].on_selector_set,
                      this._padre.escenario)(f_x);

              if (arguments.length == 1) 
              {
                let _y = fl(arguments[0] / 10);
                let _x = (rd(((arguments[0] / 10) - _y) * 10))

                this.odiv.set_x((_x * this._padre.tw) * this._padre.minimap_scale + 1);
                this.odiv.set_y((_y * this._padre.th) * this._padre.minimap_scale + 1);
                //this.odiv.set_w(this._padre.tileges)                         

                this.odiv.set_w(this._padre.tw * this._padre.minimap_scale)
                this.odiv.set_h(this._padre.th * this._padre.minimap_scale)

                this.id = arguments[0];
                this.xt = _x;
                this.yt = _y;
              }

              this._padre.tileprop.set();

            },
          },//selector


          //actualizar n capa activa
          set_capa_act(f_n = this.capa_n) 
          {
            this.capa_n = f_n;
            let _text = "Editor [" + this.capa_n + "]";
            this.win.set_title(this.on_set_title(_text));
          },
          on_set_title(f_text) 
          {
            return (f_text);
          },

          on_set_tile(f_y, f_x, f_id) 
          {

          },

          set_tile(f_y, f_x, f_id)
          {
            if (this.tileges.tilemaps[this.capa_n][f_y] == undefined || this.tileges.tilemaps[this.capa_n][f_y][f_x] == undefined)
              return;

            let _first = 1;
            if (this.tileges.tilemaps[this.capa_n][f_y][f_x] == f_id)
              _first = 0;


            this.tileges.tilemaps[this.capa_n][f_y][f_x] = f_id;
            this.on_set_tile(f_y, f_x, f_id, this.capa_n, _first);
          },

          enable_extend: 1,

         //|objcon editor
         objcon:
          {
           _padre:'',
           callback(){ },//al crear
           act:'',
           act_n:'',
           select:'', //obj en tilemaps[3]; no clip
           map:'',
           update_props_select()
           {
            let _select = this.select;
            if(_select!=='')
            {

              let _value = this._padre.tileprop.forms.json.get_value();
              let _json = JSON.parse(_value);
              for(var i in _json)
              {
               _select[i]=_json[i];
              }
              
              console.log(_select)
              

            }

           },
           set_select(f_obj)
           {
           this.select = f_obj;
           },
           delete_select()
           {
           let _select = this.select;
           if(_select!=='')
           {
             _select._clip.remove();
             this._padre.tileges.tilemaps_all[3][_select.y][_select.x]=0;
             this.select = '';

           }
            


           },
           json_sanitizador(_k, _v)
           {
                  if(get_type(_v)=='object'&&_v.noclone)
                  {
                    return null;
                  }
                  return _v;
           },

           ids:
             {
              0:{
                 _id:'', //index ids(automatico)

                 id: 'perro',
                 in: 0,
                 json:'{"direccion":0}'//nunca referenciado en tilemaps[3]
                 
                 },
              1:{
                 _id:'', //index ids(automatico)

                 id: 'perro_2',
                 in: 0,
                 json:'{"direccion":0}'//nunca referenciado en tilemaps[3]
                 
                 },

              2:{
                 _id:'', //index ids(automatico)

                 id: 'hormiga',
                 in: 0,
                 json:'{"direccion":0}'//nunca referenciado en tilemaps[3]
                 
                 },
              50:{
                 _id:'', //index ids(automatico)

                 id: 'completo',
                 in: 0,
                 json:'{"hp":0}'//nunca referenciado en tilemaps[3]
                 
                 },
              100:{
                 _id:'', //index ids(automatico)

                 id: 'w_mapoint',
                 in: 0,
                 json:'{"mapa":0}'//nunca referenciado en tilemaps[3]
                 
                 },

               101:{
                 _id:'', //index ids(automatico)

                 id: 'npc',
                 in: 0,
                 json:'{"id_npc":0, "id_move": "deambular", "overdialogos":[],  "dialogo":"_"}'//nunca referenciado en tilemaps[3]
                 
                 },

               102:{
                 _id:'', //index ids(automatico)

                 id: 'puerta',
                 in: 0,
                 json:'{"tag":"A", "destino": [0,"A" ], "visible":1, "direccion":1 }'//nunca referenciado en tilemaps[3]
                 
                 },


               110:{
                 _id:'', //index ids(automatico)

                 id: 'start_point',
                 in: 0,
                 json:'{"direccion":0}'//nunca referenciado en tilemaps[3]
                 
                 },


               111:{
                 _id:'', //index ids(automatico)

                 id: 'scroll_point',
                 in: 0,
                 json:'{"alien":["A","A"], "id_submap": 0}'//nunca referenciado en tilemaps[3]
                 
                 },
                112:{
                 _id:'end_point', //index ids(automatico)

                 id: 'end_point',
                 in: 0,
                 json:'{"clear":[0,0,0,0]  }'//nunca referenciado en tilemaps[3]
                 
                 }


             },
            set(fx, fy) //actualizar selector textarea (solo llamado click obj gamearea)
            {
              if(this._padre.modo==1)
              {
                
                let _json_array = this._padre.tileges.tilemaps_all[3][fy][fx];
                this.set_select(_json_array);

                let _ido = JSON.parse(this.ids[_json_array._id].json);
                let _obj = {};
                

                for(var i in _ido)
                {
                   _obj[i] = _json_array[i];
                }

                 
                //this._padre.tileprop.forms.name?.set_value(_json_array.id);  
                //this._padre.tileprop.forms.id?.set_value(100)

                this._padre.tileprop.forms.json.set_value( JSON.stringify(_obj, this.json_sanitizador) );
              
              }
            }

          },

         

          run() 
          {


            if (this.estado == 1) {              
              //|editor
              let _cursor = this.cursor[1];
              let _tileges = this.tileges;
              let _id = this.selector.id;
              let _offset = this.offset_obj;
              let _teclado = this.teclado;
              let _r_teclado = this.r_teclado;
              let _key = this.key;

             
              



                  //this.modo == 0 -> pintado tiles
              if (this.modo == 0 &&_cursor.estado[0] == 1 && this.estado_tiledraw == 1)
              {

                let _cx = fl((_cursor.x - (_offset.x * 2)) / ($tileges.wt * $tileges.canvasses[this.capa_n].parent_canvas.p_size));
                let _cy = fl((_cursor.y - (_offset.y * 2)) / ($tileges.ht * $tileges.canvasses[this.capa_n].parent_canvas.p_size));

                let _modo = 'pintar';

                if (_teclado.get(_key.erase[0]))
                  _modo = 'borrar';

                if (_teclado.get(_key.drop))
                  _modo = 'drop';

                if (_modo == 'pintar')
                  this.set_tile(_cy, _cx, _id);
                //_tileges.tilemaps[this.capa_n][_cy][_cx]=_id;

                if (_modo == 'borrar')
                  this.set_tile(_cy, _cx, _key.erase[1]);
                //_tileges.tilemaps[this.capa_n][_cy][_cx]=_key.erase[1];

                if (_modo == 'drop') {
                  let _drop_id = _tileges.tilemaps[this.capa_n][_cy][_cx];
                  if (_drop_id > 0) {
                    this.selector.set(_drop_id);
                  }
                }

                _tileges.refresh.force();
              }

              //pintar objetos
              if(this.modo==1)
              {
               if(_teclado.get('delete'))
                {
                  this.objcon.delete_select();
                }
              if(_cursor.estado[0] == 1 && this.objcon.act && this.estado_tiledraw==1)
              {

                
               
                _cursor.estado[0]=0;
                let _x = fl(((_cursor.x / 2) - $root.level.x) / 16);
                let _y = fl(((_cursor.y / 2) - $root.level.y) / 16);
                  
                let _obj = this.objcon.act;
               
                let _mapdata =
                {
                  ..._obj,
                  ...{
                     x: _x,
                     y: _y,
                     _id: this.objcon.act_n,
                     },
                  ...JSON.parse(this.tileprop.forms.json.get_value())
                }
                delete _mapdata.json;
                
                let _map =  _tileges.tilemaps_all[3];
                
                 _map[_y][_x] = _mapdata;
                 this.objcon.set_select(_mapdata);

                this.objcon.callback(
                                     {
                                      x: _x,
                                      y: _y,
                                      mapdata: _mapdata
                                     }
                                    );
                

              }
            }


              //control capas
              for (var i in _key.capas) {
                let k = _key.capas[i];
                if (_r_teclado.get(k, 2) == 1) {
                  this.set_capa_act(i);
                }
              }

              if (this.enable_extend 
                  //&&_teclado.get('space')

                ) {

                //extender lienzo
                let _extends = [
                  find_last_1(_teclado.get(_key.add[0]), _teclado.get(_key.rem[0])),
                  find_last_1(_teclado.get(_key.add[1]), _teclado.get(_key.rem[1])),
                  find_last_1(_teclado.get(_key.add[2]), _teclado.get(_key.rem[2])),
                  find_last_1(_teclado.get(_key.add[3]), _teclado.get(_key.rem[3])),

                ];

                _foo = ['izq', 'arr', 'der', 'aba'];
                for (var i = 0; i < 4; i++) {
                  let u = _extends[i];

                  if (u === 0) {
                    _teclado.set(_key.add[i], 2);

                    extend_multiarrays(this.tileges.tilemaps_all, { [_foo[i]]: 1 });
                    
                    


                    this.tileges.update_tilemaps();
                  }
                  if (u === 1) {
                    _teclado.set(_key.rem[i], 2);

                    extend_multiarrays(this.tileges.tilemaps_all, { [_foo[i]]: -1 });

                    this.tileges.update_tilemaps();
                  }


                }

                //end extends
              }




            }


          },
          //|menu
          menu:
          {
            Modo:
            {
            'Modo tile'()
                   {
                   this.win.escenario.cambiar(0);
                   },
            'Modo objetos'()
                   {
                   this.win.escenario.cambiar(1);
                   }

            },
            Tools:
            {
              'Mostrar tiledata'() {

                let _editor = this;
                let _win = _editor.win;
                let _tileges = _editor.tileges;

                let _swin = _win.crear_subventana({ x: 10, y: 30, w: 300, h: 300, titulo: { titulo: 'Tiledata...', xboton: 1 }, grab: 1, })

                let _text = "";
                for (var u of _tileges.tiledatas.act.col) {
                  _text += u.join('') + " ";
                }
                let _plan = crear_odiv(_swin._bloque, 0, 0, [10, 10], [10, 10], { wordWrap: 'break-word', fontSize: '11', userSelect: 'text', paddingLeft: '3px', paddingTop: '3px' });
                _plan.obj.innerHTML = _text;

              }

            },

            Map:
            {
              'Save map'() {
                this.save_map();
              },
              'Load map'(){
                this.mapcon.file_load();
              },

              'Log map'() {
                console.log(this.get_map({}, 0));

              },

              'Log current maps'() {
                console.log(this.tileges.tilemaps_all);

              },



            },
            Tiledata:
            {

              'Log tiledata'() {
                console.log(this.get_tiledata())

              },
              
              $LINE: [],
              'Save tiledata'() {
                this.save_tiledata();
              },
              
            },


            $Misc:
            {

              'neutralizar tilemap_obj'() {
                let _tilemap = this.tileges.tilemaps[0];
                let _tilemap_obj = this.tileges.tilemap_obj;

                for (var i = 0; i < _tilemap.length; i++) {
                  if (_tilemap_obj[i] == undefined) {
                    _tilemap_obj[i] = clone_array(_tilemap[i].fill(0))
                  }

                  for (var j = 0; j < _tilemap[0].length; j++) {
                    if (_tilemap_obj[i][j] == undefined) {
                      _tilemap_obj[i].push(0);
                    }

                  }
                }

                console.log(_tilemap)
                console.log(_tilemap_obj)

              },//neutralizar
              'clear tilemap_obj'() {
                let _tilemap_obj = this.tileges.tilemap_obj;
                for (var i = 0; i < _tilemap_obj.length; i++) {
                  for (var j = 0; j < _tilemap_obj[i].length; j++) {
                    _tilemap_obj[i][j] = 0;
                  }
                }

              },

            },

          },//END MENU


          //|mapcon editor
          mapcon:
          {
           _padre:'',
           act:'',

                on_load(_map)
                {
                this.set(_map);
                },
                
                set(_map)
                {
                this.act = _map;
                let _tilemaps = _map.tilemaps;
                this._padre.tileges.update_tilemaps(_tilemaps[0], _tilemaps[1], _tilemaps[2], _tilemaps[3]); 
                },

                file_load()
                {
                   FORMS.cargar_txt( (f_file, f_name)=>{ 

                       let _map = JSON.parse(f_file);

                       this.on_load(_map);


                                         
                                        });
                },

          },//mapcon

          
          save_map(f_data) {

            let _map = this.get_map(f_data, 0);
            
            let _name = 'map.json';
            if(_map.nombre!==undefined)
            {
              _name = '';
              for(var i =0;i< _map.nombre.length;i++)
              {
                let c = _map.nombre.charAt(i).toLowerCase();
                if(c==' ')
                  c = '_';

               _name += c;
              }
              _name += '.json';
            }


            save_txt(_name, JSON.stringify(_map) );

          },

          get_tiledata() {
            return (this.tileges.tiledata.get_json())
          },
          
          save_tiledata(f_nombre = "config.json") {
            save_txt(f_nombre, this.get_tiledata());
          },
          

          on_save_objtile(f_obj) {
            return (f_obj);
          },

          
          saveloop_objtile(_tilemap = this.tileges.tilemaps_all[3])
          {
          
          let _tilemap_obj = clone_array(_tilemap);

            for (var i = 0; i < _tilemap_obj.length; i++) 
            {
              for (var j = 0; j < _tilemap_obj[i].length; j++) 
              {

                if (_tilemap_obj[i][j] == undefined)
                  _tilemap_obj[i][j] = 0;

                else
                  _tilemap_obj[i][j] = this.on_save_objtile(_tilemap_obj[i][j]);
              }
            }

            return(_tilemap_obj);


          },

          on_get_map(f_data)
          {

          let _tilemap_obj = this.saveloop_objtile(this.tileges.tilemaps_all[3]);

             let _data = setloop_prop(
                  {
                   nombre: 'nuevo_mapa',
                   descripcion: "",
                   tilemaps: [...this.tileges.tilemaps, _tilemap_obj], //temporal?
                  },
                  f_data
                  
                  )


              return(_data);
             


          },

          get_map(f_data, to_string = 1) {

           
           let _data = this.on_get_map(f_data);
             
          
            if (to_string == 0)
              return (_data)

            else
              return (JSON.stringify(_data))

          },


            set_modo(f_modo = this.modo) 
            {
            this.modo = f_modo;
            this.img = this.images[f_modo];
            let _img = this.img;
             
            
            let _odiv_image = this.odiv_image;
                _odiv_image.set(0,0,_img.naturalWidth + 23, [0, 0], {background:'white', overflow:'scroll'});
            
            this.canvas.clear();
            this.canvas.ctx.drawImage(_img, 0, 0)

            //supliir tiledatas incompletos segun altura de imagen
            let _wt_total = _img.naturalHeight / this.th;
            let _tiledata = this.tileges.tiledata;

            for (var i = 0; i < _wt_total * 10; i++) {
              if (_tiledata.col[i] == undefined || _tiledata.col[i] == "undefined")
                _tiledata.col[i] = [0, 0, 0, 0];

              if (_tiledata.anim[i] == undefined || _tiledata.anim[i] == "undefined" || _tiledata.anim[i] === "")
                _tiledata.anim[i] = [""];
            }



          },
          
          //|escenario editor
          escenario: //this => _data (variable reemplazada con escenario creado)
          [
           {
            loadframe()
            {
              this.selector.odiv="";
            }
           },
           //tile
           {
            loadframe()
            {
             
             this.odiv_image = crear_odiv(_data.win._bloque, 10, 10, 10, 10, {overflowY:'scroll'});
             this.canvas = crear_canvas(this.odiv_image, 1,    0, 0, 500, 500);
             
             this.set_modo(0);

             this.tileprop.ini();
             this.selector.set(1);
            },
            enterframe()
            {
            
            },
            on_selector_set()
            {

            }

           },

           //object
           {
            loadframe()
            {
             this.odiv_image = crear_odiv(_data.win._bloque, 10, 10, 10, 10, {overflowY:'scroll'})
             this.canvas = crear_canvas(this.odiv_image, 1,    0, 0, 500, 500);
             
             this.set_modo(1);
             this.tileprop.ini();
             this.selector.set(0);
             
            },
            enterframe()
            {
            
            },

            on_selector_set(f_u)
            {

             this.editor.objcon.act = this.editor.objcon.ids[f_u];
             this.editor.objcon.act_n = f_u;

            }


           },


          ]

          ,

          //| ini editor
          ini() 
           {
            
            this.win = ventana.crear_ventana(_data.padre, { x: _data.x, y: _data.y, w: _data.w, h: _data.h, titulo: 'Editor', grab: 1, cursor: 2, menu: this.menu, menu_this: this });
            this.win.enterframe= bindear_(this.run, this);

            this.cursor = [this.win.cursor_bloque, _data.cursor_des];
            this.win.cursor_bloque.mousedown = bindear_(this.mousedown, this);
            
            this.r_teclado = _root.teclado;
            if (_root.teclado == undefined)
                this.r_teclado = TECLADO.crear_teclado(_root);

            // si no se encuentra teclado, crearlo en root
            if (this.teclado == "") 
            {

                this.teclado = this.r_teclado;
            }

           this.teclado.add_keydown(bindear_(this.key.onkeydown, this));
           this.teclado.add_keydown( bindear_(this.key.onkeyup, this))  ; 

           this.set_capa_act(1);

           this.win.crear_escenario(0, this, this.escenario);
           this.escenario = this.win.escenario;
           this.escenario.editor = this;

            
          },//ini editor


          mousedown(e) 
           {
            
            let _cursor = this.cursor[0];

            if (_cursor.x > this.odiv_image.xr && _cursor.x < this.odiv_image.xr + this.odiv_image.wr - 25 &&
              _cursor.y > this.odiv_image.yr && _cursor.y < this.odiv_image.yr + this.odiv_image.hr) {
              let _x = Math.floor((_cursor.x) / (this.tw * this.minimap_scale));
              let _y = Math.floor((_cursor.y + this.odiv_image.obj.scrollTop) / (this.th * this.minimap_scale));

              let _u = _y * 10 + _x;
              this.selector.set(_u);
              

              
              
              

            }

          },

        }, f_data
      )
      padrear(_data);

      _data.ini();




      return (_data);



    },

  },//fin debug





  //=================
  //     |WEBSOCKET
  //=================

  WEBSOCKET:
  {
    //ws://192.168.0.4:7600/
    ini(f_url, f_data) {


      let _data = setloop_prop(
        {
          ws: new WebSocket(f_url),
          message_to_json: 1,
          ready: 0,
          _on_connect(e) //llamado via onopen
          {
            this.ready = 1;
            console.log("[Conexion establecida]");

            this.on_connect(e);
          },
          _on_close(e) {
            console.log("[Conexion cerrada]");

            this.on_close(e);
          },
          _on_message(e) //macro
          {

            let _data = (e.data);
            if (this.message_to_json)
              _data = JSON.parse(_data);

            this.on_message(_data);

          },



          on_connect(e) {

          },

          on_close(e) {
          },

          on_message(e) {
            console.log("[Mensaje recibido]");
          },

          _send(f_data) {
            if (this.ready) {
              let _data = f_data;
              if (get_type(f_data) == 'object')
                _data = JSON.stringify(f_data);

              this.ws.send(_data);
            }

          },


        },
        f_data

      );

      let _ws = _data.ws;
      _ws.onopen = bindear_(_data._on_connect, _data); //disonancia de nombres voluntaria
      _ws.onclose = bindear_(_data._on_close, _data);
      _ws.onmessage = bindear_(_data._on_message, _data);

      return (_data);

    }//end ini
  },//end websocket







}//especializado...



//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!![ REFERENCIA SENCILLA A FUNCIONES]
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

for (var i in _ESPECIALIZADO) { window[i] = _ESPECIALIZADO[i]; }


AUDIO.ini();