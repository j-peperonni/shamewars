var _BASICO =
{
  //no zoom mobile  name="viewport"  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">

  IS_MOBILE: "",
  IN_IFRAME: (!(window === window.parent)),
  PADRE_IFRAME: this.parent, // -> window -> PADRE_IFRAME['nombre variable'];    //undefined -> no en iframe


  CURRENT_DIR: window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')),


  set_viewport(f_data) {

    let _data = setloop_prop({
      width: 'device-width',
      height: '',

      initial_scale: '',
      maximum_scale: '',
      minimum_scale: '',
      user_scalable: 0,

    },
      f_data
    );


    var _meta = document.getElementsByTagName('meta');
    if (_meta.length == 0) {
      _meta = document.createElement("meta");
      document.getElementsByTagName('head')[0].appendChild(_meta);

    }
    else {
      _meta = _meta[0];
    }


    _meta.setAttribute('name', 'viewport');

    let _end = "";
    for (var i in _data) {
      let _value = _data[i];
      let _i = i.replace('_', '-');

      if (_value !== "") {
        _end = _end + _i + "=" + _value + ",";
      }
    }
    _end = _end.slice(0, -1);


    _meta.setAttribute('content', _end);


    //desactivar recarga'scroll en mobiles
    document.body.style.touchAction = 'none';
    document.documentElement.style.overscrollBehavior = 'none';

  },


  sel_normal_mobile(_normal, _mobile) {

    if (IS_MOBILE == 0) {
      return (_normal);
    }

    if (IS_MOBILE == 1) {
      return (_mobile);
    }


  },


  mb(e) //adaptar evento entre desktop y mobile
  {

    if (IS_MOBILE) {

      e = clone_object(e);
      //e.preventDefault();           ! comentado en 7/17/2023 -> permitir scroll ventana imagen cargada worldsite
      e.button = 0;

      let _touch = e.touches[e.touches.length - 1];
      if (_touch == undefined) {
        _touch = e.changedTouches[e.changedTouches.length - 1];

      }


      e.x = Math.floor(_touch.clientX);
      e.y = Math.floor(_touch.clientY);
      e.clientX = Math.floor(_touch.clientX);
      e.clientY = Math.floor(_touch.clientY);

      e.pageX = Math.floor(_touch.pageX);
      e.pageY = Math.floor(_touch.pageY);

      e.target = _touch.target;
      e.layerX = Math.floor(_touch.clientX - e.target.getBoundingClientRect().x);
      e.layerY = Math.floor(_touch.clientY - e.target.getBoundingClientRect().y);

      //alert(e.layerX);


    }
    else {

    }

    return (e);

  },




  DUMMY_CANVAS: "",

  ini_dummy_canvas() {

    window['DUMMY_CANVAS'] = document.createElement('canvas');
    let _DC = DUMMY_CANVAS;
    DUMMY_CANVAS.ctx = DUMMY_CANVAS.getContext('2d');
    _DC.width = 1;
    _DC.height = 1;

    _DC.set = function (f_w, f_h) {
      if (get_type(f_w) !== 'object') {
        _DC.width = f_w;
        _DC.height = f_h;
      }
      else //se asume obj canvas (no odiv canvas)
      {

        _DC.width = f_w.width;
        _DC.height = f_w.height;
        _DC.ctx.drawImage(f_w, 0, 0)
      }
      return (_DC);
      //let _ctx = _DC.getContext('2d');
      //return({canvas:_DC, ctx: _ctx} )
    }
    //let _ctx = DUMMY_CANVAS.getContext('2d');
  },


  //odiv con funciones basicas con 'obj' custom
  crear_odiv_hueco(f_x, f_y, f_w, f_h) {

    let _foo = {
      _is: "odiv",
      _is_odiv: 1,

      padre: "",
      obj: "",
      cuadrar: 1,

      noloop: 1,

      setloop_direct: 1,
      cuadrar_hijos: 0,
      modo_borde: "interno", //interno, sobrepuesto

      z_index: "",

      locked:
      {
        locked: 0,
        odiv: "",
      },

      $: {},

      x: f_x,
      y: f_y,
      w: f_w,
      h: f_h,

      xprev: f_x,
      yprev: f_y,
      wprev: f_w,
      hprev: f_h,


      //rr -> sin modificacion de bordes
      xr: f_x, xrr: f_x,
      yr: f_y, yrr: f_y,
      wr: 0, wrr: 0,
      hr: 0, hrr: 0,


      x_orientacion: "izq",
      y_orientacion: "arr",

      opacity: 1,

      hijos: [],
      hijos_clip: [],

      propagar_enterframe: 1, //|! [08-13-2022][ver anterior: lubea inexistente]
      modulos_enterframe: [],

      crear_cursor(f_autoset) {
        CURSOR.crear_cursor(this, f_autoset);

      },

      crear_odiv(f_nombre, f_x, f_y, f_w, f_h, f_style, f_prop) {

        this[f_nombre] = crear_odiv(this, f_x, f_y, f_w, f_h, f_style, f_prop);
      },

      add_event(f_tipo, f_func, f_) {
        if (f_ == undefined) { f_ = 0; }
        _foo.obj.addEventListener(f_tipo,

          function () {
            if (_foo.locked.locked == 0) {
              f_func();
            }
          }

          , f_);

      },

      get_global() {
        let _global = this.obj.getBoundingClientRect();
        if (this.is_root != 1) {
          _global.x++; _global.y++;
        }
        return (_global);
      },


      update_hijos_depth() {
        for (var i = 0; i < this.hijos.length; i++) {

          if (this.hijos[i].obj != undefined) //empleado en gestor
          {
            this.hijos[i].obj.style.zIndex = i;
          }
          this.hijos[i].z_index = i;
        }
      },

      set_depth(f_b, f_modo) {

        set_depth(this, f_b, f_modo);

      },

      lock() {
        this.locked.locked = 1;
        if (this.locked.odiv == "") {
          _g = crear_odiv(this, 0, 0, [0, 0], [0, 0], { background: "black", opacity: 0.5 },);
        }
        this.locked.odiv = _g;
      },

      unlock() {
        this.locked.locked = 0;

        if (this.locked.odiv !== "") { this.locked.odiv.remove(); }
        this.locked.odiv = "";
      },

      remove(_remove_from_array) {
        if (_remove_from_array == 0 || _remove_from_array == undefined) {
          this.padre.hijos.splice(this.z_index, 1);
        }

        this.obj.remove();

        this.padre.update_hijos_depth();

        this.KILL_ENTERFRAME = 1;
      },

      _META_ON_UPDATE(f_) {

        if (this.cuadrar_hijos == 1) {
          let _hijo;
          for (var i in this.hijos) {
            _hijo = this.hijos[i];
            if (_hijo.update != undefined && _hijo.cuadrar == 1) {
              _hijo.update();
            }
          }


        }

        this.on_update(f_);
      },


      on_update(f_) {
      },


      update() {




        //empleado para sobrepuesto, interno; se altera aplicacion al div, no cordenadas locales
        //x,y,w,h
        let _plus = [0, 0, 0, 0];
        let _ltwh = [0, 0, 0, 0];


        let _border = this.get_borde('all');

        let _padreborder = this.padre.get_borde('all');

        if (this.modo_borde == 'interno') {
          _plus[0] = (0);
          _plus[1] = (0);
          if (this.w == 'full' || Array.isArray(this.w)) {
            _plus[2] = (0 - _padreborder[0] - _padreborder[2]);
          }
          if (this.h == 'full' || Array.isArray(this.h)) {
            _plus[3] = (0 - _padreborder[1] - _padreborder[3]);
          }
        }

        if (this.modo_borde == 'sobrepuesto') {

          if (this.x_orientacion == "izq") {
            _plus[0] = (-_border[0]);
          }
          if (this.x_orientacion == "der") {

            _plus[0] = (_border[2]);
          }

          if (this.y_orientacion == "arr") {

            _plus[1] = (-_border[1]);
          }
          if (this.y_orientacion == "aba") {
            _plus[1] = (_border[3]);
          }

          if (this.w == 'full' || Array.isArray(this.w)) {

            _plus[0] = (-_border[0]);
            _plus[2] = (-_padreborder[0] - _padreborder[2] + _border[0] + _border[2]);
          }
          if (this.h == 'full' || Array.isArray(this.h)) {
            _plus[1] = (-_border[3]);
            _plus[3] = (-_padreborder[1] - _padreborder[3] + _border[1] + _border[3]);
          }
        }


        if (this.x_orientacion == "izq") {
          _ltwh[0] = this.x;
          this.xr = this.x;
        }

        if (this.x_orientacion == "der") {

          this.xr = (this.padre.wr - (_padreborder[0] + _padreborder[2]) - this.w) - this.x;

          _ltwh[0] = this.xr;
        }

        if (this.y_orientacion == "arr") {
          _ltwh[1] = this.y;
          this.yr = this.y;
        }


        if (this.y_orientacion == "aba") {
          this.yr = (this.padre.hr - (_padreborder[1] + _padreborder[3]) - this.h) - this.y;

          _ltwh[1] = this.yr;
        }



        //anchura - altura
        if (typeof this.w == "number") {
          _ltwh[2] = this.w;
          this.wr = this.w;
        }
        else if (this.w == "full") {

          // this.x = 0+_plus[0];            //<---------
          this.x = 0;
          this.wr = this.padre.wr;


          _ltwh[2] = this.wr;

          _ltwh[0] = this.x;

        }

        //full con margen [n,n]   
        else if (Array.isArray(this.w)) {

          let _arr = this.w;

          this.x = _arr[0];
          this.wr = this.padre.wr - (_arr[1] + _arr[0]);

          _ltwh[2] = this.wr;
          _ltwh[0] = this.x;
        }



        if (typeof this.h == "number") {
          _ltwh[3] = this.h;
          //this.obj.style.height=  this.h+"px";
          this.hr = this.h;
        }
        else if (this.h == "full") {
          this.y = 0;
          this.hr = this.padre.hr;


          _ltwh[3] = this.hr;
          _ltwh[1] = this.y;
        }
        //full con margen [n,n]   
        else if (Array.isArray(this.h)) {

          let _arr = this.h;

          this.y = _arr[0];
          this.hr = this.padre.hr - (_arr[1] + _arr[0]);

          _ltwh[3] = this.hr;
          _ltwh[1] = this.y;
        }


        this.xrr = _ltwh[0]; this.xr = _ltwh[0] + _plus[0];
        this.yrr = _ltwh[1]; this.yr = _ltwh[1] + _plus[1];
        this.wrr = _ltwh[2]; this.wr = _ltwh[2] + _plus[2];
        this.hrr = _ltwh[3]; this.hr = _ltwh[3] + _plus[3];


        this.obj.style.left = _ltwh[0] + _plus[0] + "px";
        this.obj.style.top = _ltwh[1] + _plus[1] + "px";
        this.obj.style.width = _ltwh[2] + _plus[2] + "px";
        this.obj.style.height = _ltwh[3] + _plus[3] + "px";


        //                    this.obj.style.top=  this.y+"px";
        // this.obj.style.height=  this.h+"px";

        //canvas
        //alert(this.obj.width);

        //this.obj.width = this.w;
        //this.obj.height = this.h;



        let _tipo_update = { x: 0, y: 0, w: 0, h: 0, xy: 0, wh: 0, any: 0 };
        if (this.xprev != this.xr) {
          _tipo_update.x = 1;
          _tipo_update.xy = 1;
          _tipo_update.any = 1;

        }
        if (this.yprev != this.yr) {
          _tipo_update.y = 1;
          _tipo_update.xy = 1;
          _tipo_update.any = 1;
        }
        if (this.wprev != this.wr) {
          _tipo_update.w = 1;
          _tipo_update.wh = 1;
          _tipo_update.any = 1;
        }
        if (this.hprev != this.hr) {
          _tipo_update.h = 1;
          _tipo_update.wh = 1;
          _tipo_update.any = 1;
        }
        this.xprev = this.xr;
        this.yprev = this.yr;
        this.wprev = this.wr;
        this.hprev = this.hr;


        this._META_ON_UPDATE(_tipo_update);
      },
      set(f_x, f_y, f_w, f_h) {
        this.x = f_x;
        this.y = f_y;
        this.w = f_w;
        this.h = f_h;
        this.update();
      },
      set_x(ff_x) {
        this.x = ff_x;
        this.update();
      },
      set_y(ff_y) {
        this.y = ff_y;
        this.update();
      },
      set_w(ff_w) {
        this.w = ff_w;
        this.update();
      },
      set_h(ff_h) {
        this.h = ff_h;
        this.update();
      },
      set_xy(f_x, f_y) {
        this.x = f_x;
        this.y = f_y;
        this.update();
      },
      set_wh(f_w, f_h) {
        this.w = f_w;
        this.h = f_h;
        this.update();
      },
      set_opacity(f_n) {
        this.opacity = f_n;
        if (this.opacity < 0) { this.opacity = 0; }
        if (this.opacity > 1) { this.opacity = 1; }
        this.obj.style.opacity = this.opacity;
      },

      hide() {
        this.obj.style.visibility = 'hidden';
      },
      show() {
        this.obj.style.visibility = 'visible';
      },

      set_html_maxwidth(f_text, _f_plus = 0) {

        let _maxw = 0; //en caso de recibir array;

        var p = 0; //Testvar
        if (get_type(f_text) == 'object') //convertir propiedades de objecto a []
        {

          let _foo = [];
          for (var i in f_text) {
            _foo.push(i); //arrojar nombre
          }
          f_text = _foo;
        }

        if (get_type(f_text) == 'array') {
          p = 1;
        }


        if (get_type(f_text) != 'array') {
          f_text = [f_text];

        }

        for (var u of f_text) {
          this.obj.style.width = 'fit-content';//necesario en bucle para redefinir offsetWidth

          this.obj.innerHTML = u;
          this.set_w(this.obj.offsetWidth + _f_plus);

          if (this.w > _maxw)
            _maxw = this.w;

        }



        this.set_w(_maxw);

        return (_maxw);
      },

      cortar(f_w, f_h) {

        let _foo = { w: this.wr, h: this.hr };


        setloop_prop(_foo, { w: f_w, h: f_h });


        if (this.scrollbar == undefined) {

          ventana.crear_scrollbar(this, { clip_w: _foo.w, clip_h: _foo.h },

            [
              { orientacion: ['vertical', 'der'] },

              { orientacion: ['horizontal', 'aba'] }
            ]

          );
        }
        else {
          this.scrollbar.clip(_foo.w, _foo.h);
        }


      },
      set_style(f_style) {
        set_style(this.obj, f_style);
      },


      get_borde(f_n) // 0,1,2,3,   'all'
      {
        let __w = ['borderLeftWidth', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth'];
        let __c = ['borderLeftColor', 'borderTopColor', 'borderRightColor', 'borderBottomcolor'];

        function b(f_str) {
          //medium=firefix fix
          if (f_str == 'none' || f_str == '' || f_str == 'initial' || f_str == 'medium')
            return (0);


          return (Number(f_str.slice(0, -2)))


        }

        if (f_n != "all") {

          return (b(_foo.obj.style[__w[f_n]]));

        }
        else {
          return ([
            b(_foo.obj.style[__w[0]]),
            b(_foo.obj.style[__w[1]]),
            b(_foo.obj.style[__w[2]]),
            b(_foo.obj.style[__w[3]]),

          ]
          );
        }
      },

    }//_foo





    return (_foo)

  },



  //       odiv{obj:html}                                  {}
  crear_odiv(f_desodiv, f_x, f_y, f_w, f_h, __f_estilo, F_RETURN) {

    let _foo = crear_odiv_hueco(f_x, f_y, f_w, f_h);

    _foo.padre = f_desodiv;
    _foo.obj = crear_htmldivsim(f_desodiv.obj, 0, 0, 0, 0);
    _foo.z_index = _foo.padre.hijos.length;
    _foo.obj.style.zIndex = _foo.z_index; //<- fixbug



    //fin control opacidada
    _foo.obj.style.boxSizing = "border-box";




    _foo.obj.style.userSelect = "none";


    //control opacidad
    if (__f_estilo !== undefined && __f_estilo.opacity !== undefined)
      _foo.set_opacity(__f_estilo.opacity);

    else
      _foo.set_opacity(1);


    _foo.obj.ondragstart = function (e) {
      e.preventDefault();
    }




    //autoreferencia
    _foo.obj.odiv = _foo;

    if (f_desodiv.hijos != undefined)
      f_desodiv.hijos.push(_foo);


    if (f_desodiv.obj == document.body) //ejemplo: creacion en document.body...
    {
      if (f_desodiv.obj.hijos == undefined)
        f_desodiv.obj.hijos = [];

      f_desodiv.obj.hijos.push(_foo);
    }


    //establecer estilo      
    if (__f_estilo != undefined && __f_estilo != "") {

      if (__f_estilo.innerhtml != undefined) {
        _foo.obj.innerHTML = __f_estilo.innerhtml;
      }
      _foo.set_style(__f_estilo);
    }

    //establecer posicion


    //retornar 
    if (F_RETURN == undefined || F_RETURN == "") {
      //return(_foo);
    }

    //sumar propiedades a objeto existente
    else {
      //_foo.LIB_IMAGEs = F_RETURN.LIB_IMAGES;   
      for (var i in F_RETURN) {
        //if(_foo[i]==undefined)
        //{
        _foo[i] = F_RETURN[i];
        //}
      }

    }
    _foo.update();


    return (_foo);
  },//crear_odiv



  set_canvas_misc(_foo)
  {

    //draw cosillines
    _foo.draw =
    {
      _padre: _foo,                      //borde fondo
      square(f_x, f_y, f_w, f_h, f_color = ['blue', ''], f_size = 1) {

          f_color = clone_array(f_color);

        if (get_type(f_color) !== 'array') 
          f_color = [f_color, ''];


        if(get_type(f_color[0])=='array' )
          f_color[0]=arr_to_rgba(f_color[0]);

        if(get_type(f_color[1])=='array' )
          f_color[1]=arr_to_rgba(f_color[1]);
        

        let _ctx = this._padre.ctx;



        if (f_color[1] !== '') {
          _ctx.fillStyle = f_color[1];
          _ctx.fillRect(f_x, f_y, f_w, f_h);
        }

        _ctx.beginPath();

        _ctx.lineWidth = f_size;
        _ctx.strokeStyle = f_color[0];
        _ctx.rect(f_x, f_y, f_w, f_h);
        _ctx.stroke();

      },//square


         //[[x,y],[x,y], ....]
     shape(_pos,  f_color = ['blue', ''],  f_size = 1, _move=0) {

       
       f_color = clone_array(f_color);
       
        
       if (get_type(f_color) !== 'array') 
          f_color = [f_color, ''];


        if(get_type(f_color[0])=='array' )
          f_color[0]=arr_to_rgba(f_color[0]);

        if(get_type(f_color[1])=='array' )
          f_color[1]=arr_to_rgba(f_color[1]);





        let _ctx = this._padre.ctx;


        _ctx.beginPath();
        _ctx.lineWidth = f_size;

        _ctx.strokeStyle = f_color[0];
        _ctx.fillStyle   = f_color[1];

        let _m =0;
        _ctx.moveTo(_pos[0][0], _pos[0][1]);
        for(var i = 1; i<_pos.length;i++)
        {
           let u = _pos[i];
   
           if(_move>0)
           {
            _m++;
            if(_m==_move)
            {
              _m=0;
              _ctx.moveTo(_pos[i][0], _pos[i][1]);
              continue;

            }
           }
           _ctx.lineTo(_pos[i][0], _pos[i][1]);

        }

         if(f_color[1]!=='none')
        _ctx.fill();

        if(f_color[0]!=='none')
        _ctx.stroke();
        
        
        //_ctx.closePath();
        

      },//rectangle


      line(x, y, _x, _y, f_color = 'blue', f_size = 1) {

        let _ctx = this._padre.ctx;

        _ctx.beginPath();
        _ctx.lineWidth = f_size;
        _ctx.strokeStyle = f_color;

        _ctx.moveTo(x, y);
        _ctx.lineTo(_x, _y);

        // set line color
        _ctx.closePath();
        _ctx.stroke();


      },//line

    }



  },


  //           //odiv
  crear_canvas(f_donde, f_size, f_x, f_y, f_w, f_h, f_style, f_esp) {

    f_style = setloop_prop({
      position: 'absolute', imageRendering: "pixelated",
      border: '1px solid black', background: 'white', pixel_size: f_size
    }, f_style);

    f_esp = setloop_prop({ gl: 0, dom: 1, modo_borde:'sobrepuesto'}, f_esp);


    let _foo = crear_odiv_hueco(0, 0, 0, 0);
    _foo.modo_borde=f_esp.modo_borde;

    if (f_esp.dom) {
      _foo.obj = crear("canvas", f_donde.obj);
      _foo.obj.style.boxSizing = "border-box";

      f_donde.hijos.push(_foo);
    }

    else
      _foo.obj = document.createElement('canvas');


    _foo.p_size = f_size;
    //autorreferencia
    _foo.obj.odiv = _foo;
    _foo.padre = f_donde;


   



    _foo.set_style(f_style);
    _foo.set(f_x, f_y, f_w, f_h);


_foo.wini = _foo.wr;
_foo.hini = _foo.hr;




    _foo.update_p_size = function (f_psize) {
      if (f_psize == undefined) {
        f_psize = _foo.p_size;
      }
      else {
        _foo.p_size = f_psize;
      }
      _foo.obj.width = (_foo.wr / f_psize);
      _foo.obj.height = (_foo.hr / f_psize);

      _foo.obj.width_float = (_foo.wr / f_psize);
      _foo.obj.height_float = (_foo.hr / f_psize);

      _foo.obj.naturalWidth = _foo.obj.width;
      _foo.obj.naturalHeight = _foo.obj.height;

    }



    _foo.update_p_size();




    //definicion funciones      
    if (f_esp.gl == 0) {
      _foo.ctx = _foo.obj.getContext("2d");
    }
    else {
      _foo.ctx = _foo.obj.getContext("webgl");
    }

    _foo.buffers = [];



    _foo.save = function (f_filename, f_transparente, f_backcolor, f_p_size) {
      let _temp_canvas = _foo.aplanar(f_transparente, f_backcolor, f_p_size);

      let _data = setloop_prop(
        { filename: "canvas", },
        { filename: f_filename }

      );

      var _zoo = document.createElement('a');
      _zoo.setAttribute('download', _data.filename + '.png');
      _zoo.setAttribute('href', _temp_canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
      _zoo.click();

    }

    _foo.aplanar = function (f_transparente, f_backcolor, f_p_size) //obtener canvas temporal con fondo aplicado, transparente, redimensionado, para guardar
    {
      let _ctx = _foo.ctx;
      let _canvas = _foo.obj;

      let _data = setloop_prop(
        {

          transparente: 0,
          backcolor: _canvas.style.background,

          p_size: _foo.p_size,
        },
        {

          transparente: f_transparente,
          backcolor: f_backcolor,

          p_size: f_p_size,
        },

      );

      //         console.log(_data);
      let _psize = _data.p_size;


      let _temp_canvas = document.createElement('canvas');
      let _temp_ctx = _temp_canvas.getContext('2d');

      _temp_canvas.style.imageRendering = _foo.obj.style.imageRendering;

      _temp_canvas.width = _canvas.width_float * _psize;
      _temp_canvas.height = _canvas.height_float * _psize;


      let _buffold = new Uint32Array(_ctx.getImageData(0, 0, _canvas.width, _canvas.height).data.buffer);

      let _newimagedata = _temp_ctx.getImageData(0, 0, _temp_canvas.width, _temp_canvas.height);
      let _buffnew = new Uint32Array(_newimagedata.data.buffer);


      for (var i = 0; i < _canvas.height; i++) {
        for (var j = 0; j < _canvas.width; j++) {

          for (var ii = 0; ii < _psize; ii++) {
            for (var jj = 0; jj < _psize; jj++) {
              _buffnew[(((i * _temp_canvas.width) + j) * _psize) + (ii * _temp_canvas.width) + jj] = _buffold[(i * _canvas.width) + j];

            }
          }

        }
      }

      _temp_ctx.putImageData(_newimagedata, 0, 0);

      //  _temp_ctx.drawImage(_canvas, 0, 0, _foo.obj.width*_psize, _foo.obj.height*_psize);

      if (_data.transparente == 0) {
        _temp_ctx.globalCompositeOperation = 'destination-over';
        _temp_ctx.fillStyle = _data.backcolor;
        _temp_ctx.fillRect(0, 0, _canvas.width * _psize, _canvas.height * _psize);
      }


      return (_temp_canvas);
      /*
        var _zoo = document.createElement('a');
            _zoo.setAttribute('download', _data.filename + '.png');
            _zoo.setAttribute('href', _temp_canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
            _zoo.click();
     */



    }





    _foo.crear_buffer = function (f_w = _foo.wr, f_h = _foo.hr) {
      let _buf = document.createElement('canvas');
      _buf.width = f_w;
      _buf.height = f_h;

      let _obj = {
        obj: _buf,
        ctx: _buf.getContext("2d"),
        w: f_w,
        h: f_h,
        parent_canvas: _foo,
        noclone: 1,
        fill(f_color) {
          this.ctx.fillStyle = f_color;
          this.ctx.fillRect(0, 0, this.obj.width, this.obj.height);
        },
        clear() {
          this.ctx.clearRect(0, 0, this.obj.width, this.obj.height);
        },

      }

      set_canvas_misc(_obj);


      _foo.buffers.push(_obj);
      return (_obj);
    }


    _foo.__IMAGEDATA_OBJ = function (f_imagedata) {
      let _a = f_imagedata;

      this.ctx = _foo.ctx;
      this.canvas = _foo.obj;
      this.odiv = _foo;
      this.imagedata = _a;
      this.data = _a.data;
      this.view32 = (new Uint32Array(_a.data.buffer));

      this.draw_pix = function (fx, fy, f_color = 0xff000000, f_update = 0) {
        this.view32[(fy * this.imagedata.width) + fx] = f_color;

        if (f_update == 1) {
          this.update();
        }
      }

      this.draw_cua = function (f_x, f_y, f_w, f_h, f_color, f_update = 0) {
        imagedata_pintar_cua(this, f_x, f_y, f_w, f_h, f_color, f_update)

      }
      //amarillo
      this.draw_array = function (f_arr, f_t, f_x = 0, f_y = 0, f_w = f_t, f_h = f_arr.length / f_t, f_col_transparent = 4278255615) {
        let _view32 = this.view32;

        let u;

        _view32_w = _view32.length / this.imagedata.height;

        if (f_x + f_w > _view32_w) //agustar anchura fit imagedata destino
        {

          f_w -= ((f_x + f_w) - _view32_w);
        }

        for (var i = 0; i < f_h; i++) {

          for (var j = 0; j < f_w; j++) {
            u = f_arr[(i * f_t) + j];

            if (u !== f_col_transparent)
              _view32[((f_y + i) * this.imagedata.width) + f_x + j] = u;

            else
              _view32[((f_y + i) * this.imagedata.width) + f_x + j] = 0;



          }


        }

      }


      this.get_pix = function (fx, fy) {

        return (this.view32[(fy * this.imagedata.width) + fx]);
      }

      this.update = function () {
        _foo.put_imagedata(this.imagedata);
        //_foo.put_imagedata(_foo.imagedata.imagedata);
      }
      this.resize = function (f_w, f_h) {
        let _canvas = document.createElement('canvas');
        let _ctx = _canvas.getContext('2d');
        _canvas.width = f_w;
        _canvas.height = f_h;

        let _a = _ctx.getImageData(0, 0, f_w, f_h)
        this.imagedata = _a;
        this.data = _a.data;
        this.view32 = (new Uint32Array(_a.data.buffer));


      }


    }


    _foo.ini_imagedata = function () {
      this.imagedata = this.get_imagedata();
      return (this.imagedata);
    }


    _foo.get_imagedata = function () {
      let _a = this.ctx.getImageData(0, 0, this.obj.width, this.obj.height);

      return (new this.__IMAGEDATA_OBJ(_a));

    }



    _foo.set_imagedata = function (f_imagedata, f_update) {
      this.imagedata = new this.__IMAGEDATA_OBJ(f_imagedata);
      if (f_update == 1) {
        this.imagedata.update();
      }
    }



    _foo.put_imagedata = function (f_imagedata) {
      this.ctx.putImageData(f_imagedata, 0, 0);
    }







    _foo.fill = function (f_color) {
      this.ctx.fillStyle = f_color;
      this.ctx.fillRect(0, 0, this.obj.width, this.obj.height);
    }
    _foo.clear = function () {
      
      this.ctx.clearRect(0, 0, this.obj.width, this.obj.height);
    }
    //

    //draw cosillines
    set_canvas_misc(_foo);


    return (_foo);

  },



  draw_letra(f_data) {


    let _data = setloop_prop(
      {
        canvas: "",
        char: "",
        img: '',

        charpos:
          [
            " ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",
            " abcdefghijklmnñopqrstuvwxyz",
            "0123456789",
            '¡!?¿-_.,:;/ []()<>$&%#="+{}'
          ],

        x: 0,
        y: 0,
        w: [12, 32], //cut, end
        h: [16, 32], //cut, end
      },
      f_data
    )

    let _canvas = _data.canvas;
    let _ctx = _data.canvas.ctx;
    let _x = _data.x;
    let _y = _data.y;
    let _w = _data.w;
    let _h = _data.h;


    let _char = [0, 0]; //x,y
    //identificar char
    loop_i:
    for (var i = 0; i < _data.charpos.length; i++) {
      loop_j:
      for (var j = 0; j < _data.charpos[i].length; j++) {

        if ((get_type(_data.charpos[i]) == 'string' && _data.charpos[i].charAt(j) == _data.char)
          ||
          (get_type(_data.charpos[i]) == 'array' && (_data.charpos[i][j].length == 1 && _data.charpos[i][j] == _data.char || _data.charpos[i][j].length > 1 && _data.charpos[i][j][0] == _data.char))

        ) {


          _char[0] = j;
          _char[1] = i;

          break loop_i;
          break loop_j;
        }

      }

    }


    _ctx.drawImage(_data.img, _char[0] * _w[0], _char[1] * _h[0], _w[0], _h[0],

      _data.x, _data.y, _w[1], _h[1]
    )


  },




  crear_odiv_image_(f_donde, f_data) {


    let _data = setloop_prop(
      {
        url: "",

        modo: 'interno', //'interno' -> bordes compartidos; 'sobrepuesto' -> se amplia odiv contenedor
        x: 0,
        y: 0,
        w: "",
        h: "",

        style: {},
        prop: {
          wh_plus: [0, 0],
          cuadrar_hijos: 1,

          onload() { },

          on_update()//this -> odiv
          {
            if (this.obj_img !== undefined) {
              this.obj_img.width = this.wr - this.wh_plus[0];
              this.obj_img.height = this.hr - this.wh_plus[1];

            }

          },

        },

        image:
        {
          style:
          {
            position: "absolute",
            x: 0,
            y: 0,
          },
          prop:
          {
            cuadrar: 0,

          },

        },
      },
      f_data
    );


    if (_data.modo == 'interno') {
      _data.image.style.x = 0;
      _data.image.style.y = 0;
      if (_data.style.border != 'none')
        _data.prop.wh_plus = [2, 2];

    }
    if (_data.modo == 'sobrepuesto') {
      _data.image.style.x = -1;
      _data.image.style.y = -1;
      if (_data.style.border == 'none') {
        _data.image.style.x = 0;
        _data.image.style.y = 0;
      }

    }


    let _odiv = crear_odiv(f_donde, _data.x, _data.y, _data.w, _data.h,
      _data.style, _data.prop);



    if (get_type(_data.url) == "string") {
      _odiv.obj_img = crear('img', _odiv.obj);
      _odiv.obj_img.src = _data.url;

      set_style(_odiv.obj_img, _data.image.style);
      set_prop(_odiv.obj_img, _data.image.prop);
    }

    else {

      _odiv.obj_img = _data.url;

      if (_data.url.is_blob) //si es imagen en buffer?
      {
        _odiv.obj.appendChild(_odiv.obj_img);

      }
    }


    _odiv.obj_img.onload = function () {

      let _w = _odiv.w;
      let _h = _odiv.h;
      if (_odiv.w == "") // tamaño natural (imagen interna dimension original; se aumenta odiv externo para ello)
        _w = this.naturalWidth;

      if (_odiv.h == "")
        _h = this.naturalHeight;


      _odiv.set_w(_w + _odiv.wh_plus[0]);
      _odiv.set_h(_h + _odiv.wh_plus[1]);

      _odiv.onload(_odiv);

      //       console.log(_odiv.wr)
    }

    if (_data.url.is_blob)
      _odiv.obj_img.onload()



    return (_odiv)

  },


  crear_odiv_image(f_des, f_url, f_x, f_y, f_w, f_h, f_style, f_style_img, f_extra = { append: 0 }) {

    //odiv -> obj_img
    //     -> obj


    let _odiv = crear_odiv(f_des, f_x, f_y, f_w, f_h, f_style, f_extra);
    _odiv.cuadrar_hijos = 1;
    //       _odiv.obj.style.position=  "absolute";      



    if (get_type(f_url) == "string") {
      _odiv.obj_img = crear('img', _odiv.obj);
      _odiv.obj_img.src = f_url;
    }
    else {

      _odiv.obj_img = f_url;
      if (f_extra.append == 1) //si es imagen en buffer?
      {
        _odiv.obj.appendChild(_odiv.obj_img);

      }
    }

    _odiv.obj_img.setAttribute('draggable', false);
    _odiv.obj_img.cuadrar = 1;

    set_style(_odiv.obj_img, f_style_img);


    _odiv.obj_img.width = _odiv.wr;
    _odiv.obj_img.height = _odiv.hr;



    _odiv.onload = function () { }


    _odiv.obj_img.onload = function () {

      if (_odiv.w == "") // tamaño natural (imagen interna dimension original; se aumenta odiv externo para ello)
        _odiv.set_w(this.naturalWidth + 2);

      if (_odiv.h == "")
        _odiv.set_h(this.naturalHeight + 2);

      _odiv.onload(_odiv);

    };



    if (get_type(f_url) !== "string") //simular onload al recibir imagen lista
      _odiv.obj_img.onload();



    return (_odiv);

  },







  crear_odiv_iframe(f_des, f_url, f_x, f_y, f_w, f_h, f_style) //medio completar
  {

    let _odiv = crear_odiv_hueco(f_x, f_y, f_w, f_h);

    _odiv.obj = crear("iframe", f_des.obj);


    let _iframe = _odiv.obj;
    _iframe.src = f_url;


    _odiv.padre = f_des;


    _iframe.style.position = 'absolute';
    _iframe.style.left = f_x + "px";
    _iframe.style.top = f_y + "px";
    _iframe.style.width = f_w;
    _iframe.style.height = f_h;


    //f_des.obj.appendChild(_iframe);


    set_style(_iframe, f_style);

    return (_odiv);
  },







  /*
      crear_odiv_image(f_des, f_url, f_x, f_y, f_w, f_h,  f_style)
      {
       let _foo = crear_odiv_hueco(f_x, f_y, f_w, f_h);
      _foo.obj = 
      _foo.obj = crear('img', f_des.obj);
      _foo.obj.style.position=  "absolute";
   
      _foo.obj.setAttribute('draggable', false);
  
       _foo.set_style(f_style);
      _foo.obj.src = f_url;
      _foo.padre = f_des;
      _foo.update();
     
  
      f_des.hijos.push(_foo);
       
  
   
       _foo._onload = function(){};
      
      _foo.obj.onload=function()
      {
  
   
      if(_foo.w=="") // tamaño natural
       {
      _foo.set_w(this.naturalWidth);
      }
      if(_foo.h=="")
       {
        _foo.set_h(this.naturalHeight);
      }
      _foo._onload();
  
      }
  
      return(_foo);
      },
  
  */

  crear_textarea(f_donde, f_x, f_y, f_w, f_h, f_style) //compatibilidad
  {
    return (FORMS.crear_textarea(f_donde, f_x, f_y, f_w, f_h, f_style));

  },



  miscrear_odiv(f_des, f_tipo, f_x, f_y, f_w, f_h) //creacion input_image, etc...
  {
    let _foo = crear_odiv_hueco(f_x, f_y, f_w, f_h);
    _foo.obj = crear(f_tipo, f_des.obj);
    _foo.obj.style.position = "absolute";
    _foo.padre = f_des;
    _foo.update();


    return (_foo);
  },

  //creacion objeto html
  //      ,,,,    html_obj
  crear(f_tipo, f_des) {
    let h_des;
    if (f_des.constructor === String) { h_des = idear(f_des); }
    else { h_des = f_des; }

    var foo = document.createElement(f_tipo);

    h_des.appendChild(foo);
    return (foo);
  },




  crear_htmldivsim(f_des, f_x, f_y, f_w, f_h) {
    let foo = crear("div", f_des);
    foo.style.position = "absolute";
    foo.style.left = f_x + "px"; foo.style.top = f_y + "px";
    foo.style.width = f_w + "px"; foo.style.height = f_h + "px";
    foo.style.overflow = "hidden";
    foo.style.border = "1px solid black";
    foo.style.background = "white";
    return (foo);
  },


  idear(f_id, f_donde) {
    if (f_donde == undefined) { return (document.getElementById(f_id)); }
    else { return (f_donde.getElementById(f_id)); }
  },




  cargar_script(f_url, f_callback, f_type = '') //nueva version
  {

    var _script = document.createElement("script");

    _script.src = f_url;
    _script.type = f_type;

    document.body.appendChild(_script);


    _script.onload = function () {
      if (get_type(f_callback) == 'function') {
        f_callback(_script.class, _script);
      }
    }

    return (_script);

  },


  /*
   cargar_script(f_url, PUENTE, f_tipo)
   {
   
   var _js = document.createElement("script");

   _js.PUENTE = PUENTE;
   _js.$PUENTE = PUENTE;

   if(f_tipo!=undefined){
       _js.type = f_tipo;
                        }
   
   _js.src = f_url;

   document.body.appendChild(_js);
   
   return _js;

   },
  */


  crear_oarr(f_data) {
    let _oarr = setloop_prop(
      {
        padre: '',
        childs: [],
        childs_oarr: [],
        childs_raw: [],

        is_oarr: 1,
        find(f_data, f_donde = this) {
          let _end;

          _u:
          for (var u of f_donde.childs) {

            if (u == f_data) {
              _end = {
                value: u,
                donde: f_donde,
                //  arr:f_childs
              };
              break _u;
            }


            if (u.is_oarr) {
              _end = this.find(f_data, u);
              if (_end)
                break _u;
            }

          }

          return (_end)

        },

        remove() {

          for (var i = 0; i < this.padre.childs.length; i++) {
            let u = this.padre.childs[i];
            if (u == this) {
              this.padre.childs.splice(i, 1);
              break;
            }
          }
          for (var i = 0; i < this.padre.childs_oarr.length; i++) {
            let u = this.padre.childs_oarr[i];
            if (u == this) {
              this.padre.childs_oarr.splice(i, 1);
              break;
            }
          }

        },
        add(f_data, f_group = 0) {
          if (f_group == 0) {
            if (get_type(f_data) == 'array') {
              this.childs.push(...f_data);
              this.childs_raw.push(...f_data);
            }
            if (get_type(f_data) !== 'array') {
              this.childs.push(f_data);
              this.childs_raw.push(f_data);
            }
          }

          if (f_group == 1) {
            if (get_type(f_data) !== 'object') {
              f_data = { childs: f_data, childs_raw: f_data };
            }

            let _oarr = crear_oarr(f_data);
            _oarr.padre = this;

            this.childs.push(_oarr);
            this.childs_oarr.push(_oarr);

            return (_oarr)
          }



        },

      },

      f_data
    )


    return (_oarr);


  },




  crear_array(f_length, f_data = '') {

    var _a = [];
    for (var i = 0; i < f_length; i++) {
      _a.push(f_data);
    }

    return (_a);
  },


  crear_multiarray(f_a, f_b, f_data = 0) //array multidimensional vacio [0,0,0 ...]
  {
    var _end = [];
    let _type = get_type(f_data);

    for (var i = 0; i < f_a; i++) {

      let _a = [];
      for (var j = 0; j < f_b; j++) {

        if (_type == 'function')
          _a.push(f_data());

        else
          _a.push(f_data);


      }

      _end.push(_a);



    }

    return (_end);

  },

  //remover de array[] los elementos de arrayb[]
  remove_from_arr(_arr, _g) {

    return (_arr.filter((e) => {

      for (var j of _g) {
        if (e == j)
          return (0);
      }
      return (1)

    })

    )


  },


  //obtener 'valores finales' de conjunto de arrays
  find_end_array(f_arr, f_func = undefined) {

    let _end = [];

    function _rec(_arr) {
      for (var u of _arr) {

        if (get_type(u) !== 'array') {
          if (f_func !== undefined)
            _end.push(f_func(u));

          else
            _end.push(u);


        }
        else {
          _rec(u);
        }

      }

    }

    _rec(f_arr);


    return (_end);


  },



  //encontrar valor en conjunto de array; retornar 0 || {ultimo grupo, arbol  }
  find_in_array(f_arr, f_i) {

    let _found = 0;


    function _rec(_arr, _tree = [], _itree = []) {
      if (_found !== 0) return;


      for (var i = 0; i < _arr.length; i++) {
        let u = _arr[i];

        if (get_type(u) == 'array') {
          let _tree_2 = [];
          for (var uu of _tree) {
            _tree_2.push(uu);
          }
          _tree_2.push(u)


          let _itree_2 = clone_array(_itree);
          _itree_2.push(i)

          _rec(u, _tree_2, _itree_2)
        }

        if (get_type(f_i) !== 'array' && u == f_i ||
          get_type(f_i) == 'array' && array_compare(u, f_i)) //ENCONTRAR<---------------
        {
          //  if(get_type(f_i)=='array')
          //    alert("found")

          _found = {
            last: _arr,
            tree: _tree,
            i_tree: _itree, //indice 'i' de tree retornado
          };

        }


      }
    }

    _rec(f_arr, [f_arr]);



    return (_found);

  },


  loop_in_array(f_arr, f_func = undefined, f_in_obj = 0, f_set = 1) {

    function _rec(_arr) {
      for (var i = 0; i < _arr.length; i++) {
        let u = _arr[i];
        let _type = get_type(u);

        if (_type !== 'array' && (f_in_obj == 0 || f_in_obj && _type !== 'object')) {
          if (f_func !== undefined) {
            if (f_set)
              _arr[i] = f_func(u, i, _arr);
            else
              f_func(u, i, _arr);
          }

        }
        if (_type == 'array')
          _rec(u);

        if (f_in_obj && _type == 'object') {
          _rec(Object.values(u));
        }

      }

    }

    _rec(f_arr);


    return (f_arr);


  },


  array_from_no_undefined() {
    let _arr = [];
    for (var u of arguments) {
      if (u !== undefined)
        _arr.push(u);

    }
    return (_arr);

  },


  array_compare(f_a, f_b) {


    return (JSON.stringify(f_a) == JSON.stringify(f_b));

  },


  clone_array(_arr, clone_obj = 0) {

    var clone = [];
    for (var i in _arr) {


      if (_arr[i] != null && get_type(_arr[i]) == "array") {
        clone[i] = clone_array(_arr[i], clone_obj);
      }

      else {
        if (clone_obj == 1) {
          if (get_type(_arr[i]) != "object")
            clone[i] = _arr[i];
          else
            clone[i] = clone_object(_arr[i], clone_object);
        }
        else
          clone[i] = _arr[i];

      }
    }
    return clone;
  },


  /*
 clone_array(obj) {
  
  var clone = [];
  for(var i in obj) {
      if(obj[i] != null &&  get_type(obj[i])=="array")
          clone[i] = clone_array(obj[i]);
      else
          clone[i] = obj[i];
  }
  return clone;
  },
 */

  clone_object(obj) {


    // no clonar objecto con prototipos especializados
    if (obj.constructor == undefined || obj.constructor != undefined && obj.constructor.name != 'Object') {
      obj.noclone = 1;
    }

    if (obj.noclone !== 1) {

      var clone = {};

      for (var i in obj) {
        // if(obj[i] != null &&  typeof(obj[i])=="object")
        if (obj[i] != null && get_type(obj[i]) == "object") {

          clone[i] = clone_object(obj[i]);
        }

        else if (get_type(obj[i]) == "array") {
          clone[i] = clone_array(obj[i], 1);
          //clone[i] = clone_array(obj[i]); //comentado en 09/23/2023
        }

        else {
          clone[i] = obj[i];
        }
      }
      return clone;
    }
    else {
      return (obj);
    }
  },


  call_funarr(f_arr, _args = [])//llamar funcion si es funcion o iterar en array de funciones
  {

    if (get_type(f_arr) == 'function')
      f_arr(..._args);

    else {
      for (var u of f_arr)
        u(..._args);

    }

  },


  copy_to_clipboard(f_text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = f_text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  },

  esdefinido(f_var) // 1 si esta definido; no es ""
  {
    let _f = 0;
    if (f_var != "" && f_var != undefined) {
      _f = 1;
    }
    return (_f);
  },

  esundempty(f_var) // 1 si esta definido; no es ""
  {
    let _f = 0;
    if (f_var === "" || f_var === undefined) {
      _f = 1;
    }
    return (_f);
  },

  //[varname, valor entonces]
  esundempty_then(f_quien, arr_name_then) {

    if (f_quien[arr_name_then[0]] == "" || f_quien[arr_name_then[0]] === "undefined") {
      f_quien[arr_name_then[0]] = arr_name_then[1];
    }

  },


  is_numeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  },





  //    [f_donde, f_variable(string)]
  n_set(f_donde, f_n, f_max) {

    if (f_n == "->") {
      f_donde[0][f_donde[1]]++;
      if (f_donde[0][f_donde[1]] > f_max) {
        f_donde[0][f_donde[1]] = 0;
      }
    }

    if (f_n == "<-") {
      f_donde[0][f_donde[1]]--;
      if (f_donde[0][f_donde[1]] < 0) {
        f_donde[0][f_donde[1]] = f_max;
      }
    }

    if (f_n != '->' && f_n != '<-') {
      f_donde[0][f_donde[1]] = f_n;
      if (f_donde[0][f_donde[1]] > f_max) {
        f_donde[0][f_donde[1]] = f_max;
        alert("ERROR: ");
      }
    }



  },


  //[ , ]   
  padrefind_recursivo(f_odiv, f_prop, f_n) //encontrar propiead en objetos anidados
  {
    var i = 0;
    var imax = f_n;

    let _f = function (f_obj) {

      if (f_obj.padre != undefined) {

        if (f_obj.padre[f_prop[0]] == f_prop[1]) {

          return (f_obj.padre);

        }

        else {
          if (i < imax) {

            i++;
            return (_f(f_obj.padre));

          }

        }
      }
    }

    var _r = _f(f_odiv);

    return (_r);

  },

  //n; descartar undefined en array
  n_elem_in_array(f_arr) {

    let _n = 0;
    for (var u of f_arr) {
      if (u !== undefined)
        _n++;
    }

    return (_n);

  },


  get_type(f_quien) {
    if (f_quien == undefined)
      return ('undefined');
    let _r = typeof (f_quien);
    if (Array.isArray(f_quien)) {
      _r = "array";
    }



    return (_r);
  },


  ex(f_obj) {
    if (f_obj !== undefined)
      return 1;

    return (0);
  },



  //['_padre', ""]
  padrear(f_obj, only_if = ['_padre', ""], f_prop = '_padre',) {
    let _padre = f_obj;
    for (var i in f_obj) {


      let _u = f_obj[i];

      if (get_type(_u) == 'object') {
        if (only_if === "" || _u[only_if[0]] === only_if[1]) {

          padrear(_u, only_if, f_prop);

          _u[f_prop] = _padre;

        }


      }

    }

  },

  dualset(f_a, f_b) //aplica a A <- B si B no es invalido
  {
    if (f_b !== undefined && f_b !== "") {
      f_a = f_b;
    }

    return (f_a);


  },


  protobj(f_proto, f_obj, f_ini = 1) {

    if (f_proto !== undefined) {


      Object.setPrototypeOf(f_obj, f_proto)

      let _obj = Object.assign(Object.create(f_proto), f_obj);

      if (f_ini == 1 && get_type(_obj.ini) == 'function') {
        _obj.ini();
      }

      //eliminar propiedades de mismo nombre para evitar...

      /*
      for(var i in f_proto)
      {
         if(f_obj[i]!==undefined)
         {
           delete f_obj[i];
         }
      }
      */

      //console.log(_obj.pillin)
      //padrear(_obj);


      return (_obj)

    }


  },




  //f_activo
  setloop_prop(f_cliente, f_arrs, f_data)  //2.0 -> permite aplicacion multiple via array
  {

    let _data = {
      array_directo: 1,
    };

    if (f_data !== undefined)
      setloop_prop(_data, f_data)


    if (get_type(f_arrs) !== "array") {
      f_arrs = [f_arrs];
    }


    for (var j in f_arrs) {

      let f_activo = f_arrs[j];




      for (var i in f_activo) {

        if (f_activo[i] !== undefined) {

          let _send;
          let _type = get_type(f_activo[i]);
          let _ctype = get_type(f_cliente[i]);


          if (_type == 'number' || _type == 'string' || _type == 'boolean' || _type == 'function')
            _send = f_activo[i];


          if (_type == 'array') {
            if (_data.array_directo == 1) //copiar directamente array        
              _send = f_activo[i];//clone_array(f_activo[i]); [solucion? bug de itineracion involuntaria][04-22-2023]


            else               //itinerar elemento por elmeento (se asumen valores primitivo)(01-19-2023)
            {
              for (var j = 0; j < f_activo[i].length; j++) {

                //    console.log(f_activo[i][__i])
                f_cliente[i][j] = f_activo[i][j];

              }
              _send = f_cliente[i];
            }
          }


          if (_type == 'object') {


            if (_ctype != 'object') {


              if (i != 'image' && _ctype !== 'undefined' && f_activo[i].setloop_direct !== 1) // fix provisorio      
                _send = clone_object(f_activo[i]);


              else
                _send = f_activo[i];

            }


            else {
              if (f_cliente[i].noloop !== 1 && f_activo[i].noloop !== 1)
                _send = setloop_prop(f_cliente[i], f_activo[i], f_data)

              else
                _send = f_activo[i];

            }

          }


          f_cliente[i] = _send;

        }
      }


    }


    return (f_cliente);

  },


  ordenar_array(f_arr) {
    return (f_arr.sort(function (a, b) { return a - b }));

  },

  number_to_arr_digitos(f_n) {
    return ([...f_n + ''].map(n => +n));

  },


  random_from_array(f_array) {

    let _sel = rand_bet_(0, f_array.length - 1);
    return (f_array[_sel]);

  },

  rand_bet(f_min, f_max) // si max = 3 ; regresa [0,1,2]
  {
    return (Math.floor(Math.random() * (f_max - f_min)) + f_min);

  },
  rand_bet_(f_min, f_max) // si max = 3 ; regresa [0,1,2,3]
  {
    return (Math.floor(Math.random() * ((f_max + 1) - f_min)) + f_min);

  },


  //demasiados digitos[e>9&&dec>8] puede afectar precision
  trunc_dec(f_n, f_dec = 3) {

    let _a = 10 ** f_dec;

    return (Math.trunc(f_n * (_a)) / _a);

  },

  //                           filtro tipo entrante (f_data)
  //                             )                              
  push_if_not_exist(f_arr, f_data, f_type) {


    //workarond para algo...
    if (get_type(f_data) == 'array') {
      for (var u of f_data)
        push_if_not_exist(f_arr, u, f_type);

      return;
    }


    let _t = get_type(f_data);

    for (var u of f_arr) {

      if (u == f_data || (f_type !== undefined && _t === f_type)) {
        return;

      }

    }

    f_arr.push(f_data);
  },



  get_base64_from_image(f_img, f_data) {

    let _data = setloop_prop(
      {

        w: "", //natural
        h: "", //natural

        remove: 1, //eliminar 'data:image/png;base64,
      }
      , f_data
    );

    let _canvas = DUMMY_CANVAS;
    let _w;
    let _h;
    if (_data.w === "")
      _w = f_img.naturalWidth;
    else
      _w = _data.w;

    if (_data.h === "")
      _h = f_img.naturalHeight;
    else
      _h = _data.h;

    _canvas.height = _h;
    _canvas.width = _w;

    let _ctx = _canvas.getContext('2d');
    //_canvas.style.background='red';
    _ctx.drawImage(f_img, 0, 0, _w, _h);
    let _base64String = _canvas.toDataURL();

    if (_data.remove == 1) {
      _base64String = _base64String.replace('data:image/png;base64,', '');
    }

    return (_base64String);
  },


  setloop_prop_(f_des, f_input) {

    for (var i in f_input) {
      //
      //if(f_input[i] !== "" && f_input[i] !== " " && typeof f_input[i] !== 'object' && f_input[i] !== null    && f_input[i]!=undefined)


      if (typeof f_input[i] == 'number' || typeof f_input[i] == 'string') {
        f_des[i] = f_input[i];
      }

      //array //verificar en caso de error
      if (Array.isArray(f_input[i])) {
        f_des[i] = f_input[i];
      }

      if (typeof f_input[i] === 'object' && f_input[i] !== null) {

        //verificar si OBJETO existe en destino
        if (f_des[i] != undefined && f_input[i]._nosetloop != 1) {

          setloop_prop(f_des[i], f_input[i]);
        }

        if (f_input[i]._nosetloop == 1) //puntual; manejo rawimagen
        {
          f_des[i] = (f_input[i]);
        }


        //verificar si OBJETO no existe en destino; duplicarlo
        if (f_des[i] == undefined && f_input[i] != undefined) {

          f_des[i] = clone_array(f_input[i]);
        }
      }

    }

    return (f_des);

  },


  fl(fn) {
    return (Math.floor(fn));
  },


  rd(fn) {
    return (Math.round(fn));
  },


  cl(fn) {
    return (Math.ceil(fn));
  },


  swap_bin(f_n) {
    if (f_n === 0)
      return (1)
    else if (f_n === 1)
      return (0)

  },

  get_extension(f_string, f_conpunto = 0) {

    let c;

    let _end = "";
    let _nochar = [" ", "."];
    if (f_conpunto == 1)
      _nochar = [" "];


    for (var i = f_string.length; i >= 0; i--) {
      c = f_string.charAt(i);

      let _copy = 1;
      for (var u of _nochar) {
        if (u == c) {
          _copy = 0;
          break;
        }
      }

      if (_copy == 1)
        _end = c + _end;


      if (c == '.')
        return (_end.toLowerCase());

    }

    return ("");

  },
  //parsear
  cargar_txt(f_url, f_callback, f_json = 0) {


    var _request = new XMLHttpRequest();
    _request.open('GET', f_url);
    _request.onreadystatechange = function () {
      if (_request.readyState == 4)//DONE
      {
        if (f_callback != undefined) {
          if (f_json == 0)
            f_callback(_request.responseText, get_filename_from_url(f_url), _request);

          else
            f_callback(JSON.parse(remove_linebreak(_request.responseText)), get_filename_from_url(f_url), _request);

        }
      }
    }
    _request.send();

    return (_request);
  },

  get_html_maxwidth(f_text, f_plus = 0) {
    let _foo = crear_odiv(_root, 0, 0, 0, 0);

    _foo.set_html_maxwidth(f_text, f_plus);
    let _w = _foo.wr;
    _foo.remove();

    return (_w);

  },


  loopmatch(f_arr, f_pos) {

    if (get_type(f_arr) == 'array') {
      for (var u of f_arr) {
        if (u === f_pos) {
          return (1);
        }
      }
    }

    if (get_type(f_pos) == 'object') {
      for (var u of f_arr) {
        if (u === f_pos.data) {
          return (1);
        }
      }
    }


    return (0);

  },


  loopij(f_arr, f_func) {

    for (var i = 0; i < f_arr.length; i++) {
      for (var j = 0; j < f_arr[i].length; j++) {

        let u = f_arr[i][j];

        f_func({ data: u, i: i, j: j });

      }
    }

  },


  en_array(f_arr, f_data) {

    for (var i of f_arr) {
      if (i == f_data)
        return (1);
    }

    return (0);

  },


  arr_getvecin(f_arr, f_data) {


    let _data = setloop_prop(
      {
        x: 0,
        y: 0,
        w: 1,
        h: 1,

      }
      ,
      f_data
    )

    let _arr = f_arr;
    let _x = _data.x;
    let _y = _data.y;
    let _w = _data.w;
    let _h = _data.h;


    let _end = { izq: [], arr: [], der: [], aba: [], all: [] };

    //izq der
    for (var i = 0; i < _h; i++) {
      //regresa 0
      _arr[i + _y][_x - 1] && !loopmatch(_data.discard, _arr[i + _y][_x - 1]) && _end.izq.push({ data: _arr[i + _y][_x - 1], y: i + _y, x: _x - 1, dir: 'izq' });


      _arr[i + _y][_x + (_w - 1) + 1] && !loopmatch(_data.discard, _arr[i + _y][_x + (_w - 1) + 1]) && _end.der.push({ data: _arr[i + _y][_x + (_w - 1) + 1], y: i + _y, x: _x + (_w - 1) + 1, dir: 'der' });

    }

    //arr aba
    for (var j = 0; j < _w; j++) {
      _arr[_y - 1] && !loopmatch(_data.discard, _arr[_y - 1][j + _x]) && _end.arr.push({ data: _arr[_y - 1][j + _x], y: _y - 1, x: j + _x, dir: 'arr' });

      _arr[_y + (_h - 1) + 1] && !loopmatch(_data.discard, _arr[_y + (_h - 1) + 1][j + _x]) && _end.aba.push({ data: _arr[_y + (_h - 1) + 1][j + _x], y: _y + (_h - 1) + 1, x: j + _x, dir: 'aba' });


    }

    _end.all = [..._end.izq, ..._end.arr, ..._end.der, ..._end.aba];
    return (_end)


  },




  multiline_samewidth(f_string, f_to_array = 1) {
    let _max = 0;
    let _x = 0;
    //identificar linea max
    for (var i = 0; i < f_string.length; i++) {
      u = f_string.charAt(i);

      if (u == '\n') {
        if (_x > _max) {
          _max = _x;
        }

        _x = 0;
        continue;
      }


      _x++;
    }


    //sumar espacio en blanco
    let _end = [];
    let _new = [];

    _x = 0;
    for (var i = 0; i < f_string.length; i++) {
      u = f_string.charAt(i);

      if (u == '\n') {

        for (var t = _x; t < _max; t++) {
          _new.push(" ");

        }
        _end.push(_new);
        _new = [];
        _x = 0;
        continue;
      }

      if (u != '\n')
        _new.push(u);

      _x++;
    }

    if (f_to_array == 1)
      return (_end);

    else {
      let __end = "";
      for (var u of _end) {
        for (var j of u) {
          __end += j;

        }
        __end += '\n';
      }
      return (__end);

    }

  },



  get_distance(x, y, xx, yy) {

    var a = x - xx;
    var b = y - yy;

    var c = Math.sqrt(a * a + b * b);
    return (c);
  },

  setprop_unex(f_donde, f_datos) {

    if (f_donde == undefined) {

      f_donde = {};

    }
    for (var i in f_datos) {
      if (esundempty(f_donde[i])) {

        f_donde[i] = f_datos[i];

      }
    }

    return (f_donde);
  },


  //      html obj
  set_style(f_html, f_style, f_reset) {


    let _type = get_type(f_style);

    if (_type == "array") {

      for (var i in f_style) {
        let _u = f_style[i];
        set_style(f_html, _u);
      }
    }

    if (_type == "object") {

      let u;
      for (var i in f_style) {
        u = f_style[i];
        if (i != "innerHTML") {
          if (i == 'x') {
            i = 'left';
            u += 'px';
          }

          if (i == 'y') {
            i = 'top';
            u += 'px';
          }

          f_html.style[i] = u;

        }

        else {
          f_html.innerHTML = u;

        }
      }
    }


  },


  find_json_from_string(f_texto, f_index) {

    f_texto = f_texto.replace(/'/g, '"');

    let _llaves = [0, 0];
    for (var i = f_index; i < f_texto.length; i++) {
      let u = f_texto.charAt(i);
      //if(u=="'")f_texto = f_texto.slice(0,i)+'"'+f_texto.slice(i,0);
      

      if (u == "{")
        _llaves[0]++;
      if (u == "}")
        _llaves[1]++;

      if (_llaves[0] > 0 && _llaves[1] > 0 && _llaves[0] == _llaves[1]) {
        let _end = (f_texto.slice(f_index, i + 1))
        return ({
          texto: _end,
          json: JSON.parse(_end),
          a: f_index,
          b: i,
        });
        break;

      }

    }




  },



  //      html obj
  set_prop(f_html, f_prop) {

    let _type = get_type(f_prop);

    if (_type == "object") {

      let u;
      for (var i in f_prop) {
        u = f_prop[i];

        f_html[i] = u;


      }
    }


  },


  detect_mobile() {
    return (navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i))

  },


  //====================================
  //            UNI EVENTS
  //====================================

  uni_mousedown(f_des, f_func) {
    if (IS_MOBILE == true) {
      f_des.ontouchstart = function (e) {
        e.x = e.touches[0].clientX;
        e.y = e.touches[0].clientY;
        e.offsetX = e.touches[0].clientX;
        e.offsetY = e.touches[0].clientY;
        e.pageX = e.touches[0].clientX;
        e.pageY = e.touches[0].clientY;
        //workarround
        e.path = [f_des];
        //
        //FIX WORKARROUND   
        var binded_func = f_func.bind(f_des);
        binded_func(e);
      }
    }
    else { f_des.onmousedown = f_func; }
  },

  uni_mouseup(f_des, f_func) {
    if (IS_MOBILE == true) {
      f_des.ontouchend = function (e) {
        e.x = e.changedTouches[0].clientX;
        e.y = e.changedTouches[0].clientY;
        //FIX WORKARROUND
        var binded_func = f_func.bind(f_des);
        binded_func(e);
      }
    }

    else { f_des.onmouseup = f_func; }
  },

  uni_mousemove(f_des, f_func) {

    if (IS_MOBILE == true) {

      f_des.ontouchmove = function (e) {
        e.x = e.touches[0].clientX;
        e.y = e.touches[0].clientY;
        e.pageX = e.x;
        e.pageY = e.y;
        var binded_func = f_func.bind(f_des);
        binded_func(e);
        //f_func(e);
      }
    }
    else { f_des.onmousemove = f_func; }
  },





  arr_control(f_arr, f_a, f_b, f_modo) {

    let _default = {

      movelast: 0,
      movefirst: 0,

      swap: f_b,
      swaplast: f_arr.length - 1,
      swapfirst: 0,
    };

    if (typeof f_modo == 'string') {
      f_b = _default[f_modo];

    }

    let _modo = f_modo;

    let _a = f_arr[f_a];
    let _b = f_arr[f_b];

    let _az = f_a;
    let _bz = f_b;



    if (_modo == 'move') // n
    {

      f_arr.splice(_az, 1);

      f_arr.splice(f_b, 0, _a);


    }


    if (_modo == 'movelast') {
      f_arr.push(_a);
      f_arr.splice(_az, 1);
    }

    if (_modo == 'movefirst') {
      f_arr.splice(_az, 1);

      f_arr.splice(0, 0, _a);
    }




    if (_modo == 'swap') //necesita n
    {

      f_arr.splice(_bz, 1, _a);
      f_arr.splice(_az, 1, _b);

    }

    if (_modo == 'swaplast') {
      f_arr.splice(f_arr.length - 1, 1, _a);

      f_arr.splice(_az, 1, _b);

    }
    if (_modo == 'swapfirst') {

      f_arr.splice(0, 1, _a);
      f_arr.splice(_az, 1, _b);

    }




  },



  set_depth(f_quien, f_b, f_modo) {

    arr_control(f_quien.padre.hijos, f_quien.z_index, f_b, f_modo);


    f_quien.padre.update_hijos_depth();


  },



  _swap(fa, fb) {



  },

  //['var',donde]
  swap(f_a, f_b) {
    let _donde_a = window;
    let _donde_b = window;

    let _var_a = f_a;
    let _var_b = f_b;
    if (get_type(f_a) == "array") {
      _var_a = f_a[0];
      _donde_a = f_a[1];
    }
    if (get_type(f_b) == "array") {
      _var_b = f_b[0];
      _donde_b = f_b[1];
    }


    let _a = _donde_a[_var_a];

    _donde_a[_var_a] = _donde_b[_var_b];
    _donde_b[_var_b] = _a;

  },



  ////////////////////////////////////////////////
  //           MISC
  ///////////////////////////////////////////////


  ////////////////////////////////////////////////
  //
  /////////////////////////////////////////////////



  bindear(f_func, f_bind) {
    let _bind = f_func.bind(f_bind);
    _bind();

    return (_bind);

  },

  bindear_(f_func, f_bind) {
    let _bind = f_func.bind(f_bind);

    return (_bind);

  },


  arr_to_rgba(f_arr=[0,0,0,0])
  {
   f_arr = clone_array(f_arr);

   if(f_arr.length ==3)
    f_arr.push(1);


   let _end = 'rgba(';

   let u;
   for(var i =0;i< f_arr.length;i++)
   {
    u = f_arr[i];

    _end += u;
    if(i<3)
      _end +=',';
    if(i==3)
      _end +=')'
   }

   return(_end);

},



  random_rgb(f_rgb_func = 0) {
    let _r = fl(Math.random() * 255);
    let _g = fl(Math.random() * 255);
    let _b = fl(Math.random() * 255);

    if (f_rgb_func)
      return ("rgb(" + _r + "," + _g + "," + _b + ")");

    else
      return ([_r, _g, _b]);

  },


  random_hex(len) {
    const hex = '0123456789ABCDEF';
    let _end_hex = '0x';
    for (let i = 0; i < len; ++i) {
      _end_hex += hex.charAt(Math.floor(Math.random() * hex.length));
    }




    return (parseInt(_end_hex));
  },


  war(f_nombre, data) {

    window[f_nombre] = data;
  },


  string_to_number(f_n) {

    return (parseFloat(f_n));

  },


  minmax(fa, fb) {
    if (fa < fb)
      return ([fa, fb])

    else
      return ([fb, fa])
  },


  cerear(f_n, f_ceros) {

    let _string = f_n.toString();
    ;
    for (var i = _string.length; i < f_ceros; i++) {
      _string = "0" + _string;

    }


    //if(to_number==1)
    //   _string = string_to_number(_string);

    return (_string);

  },




  //secnum([f_x, f_y], 2, ['X','Y'])   = X00Y00
  secnum(f_arrnum, f_ceros, f_arrchar_ini, f_arrchar_end) {

    let _string = "";
    for (var i = 0; i < f_arrnum.length; i++) {
      let n = f_arrnum[i];
      if (f_arrchar_ini !== undefined)
        _string += f_arrchar_ini[i];

      _string += cerear(n, f_ceros);


      if (f_arrchar_end !== undefined)
        _string += f_arrchar_end[i];

    }


    return (_string);

  },

  get_percentage(f_max, f_per) {

    if (get_type(f_per) == 'string') {
      f_per = string_to_number(f_per);
    }

    return ((f_max * f_per) / 100)

  },

  get_mid(a, b) {

    if (a > b) {
      let A = a;

      a = b;
      b = A;
    }


    let _h;

    if (a < 0 || b < 0) {
      _h = (b + a) / 2;
    }
    if (a >= 0 || b >= 0) {
      _h = a + (b - a) / 2;
    }

    return (_h);





  },

  get_maxline(f_arr) {

    let _l = 0;
    let _sel = "";
    for (var u of f_arr) {
      if (u.length > _l) {
        _l = u.length;
        _sel = {
          text: u,
          n: u.length,
        };
      }

    }
    return (_sel);

  },


  replace_from_string(f_string, f_char, f_new) {
    if (get_type(f_char) == 'array') {
      f_char = f_char.toString();
    }


    return (f_string.replace(new RegExp("[" + f_char + "]", "g"), f_new));


  },


  save_txt(f_filename, f_text, f_callback_ok, f_callback_cancel) //filename sin .nnn = se asume .txt
  {
    let _element = document.createElement('a');
    _element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(f_text));
    _element.setAttribute('download', f_filename);

    _element.style.display = 'none';
    document.body.appendChild(_element);

    _element.click();




    window.setTimeout(function () {

    }
      , 10);

    document.body.removeChild(_element);
  },

  remove_lastspace_string(_str)
  {

          let _foo = '';
              for(var i = _str.length;i--;i>0)
                   {
                    let u = _str.charAt(i);
                    if(_foo === '' && u ==' ')
                      continue;
                    _foo = u+_foo;

                   }

           return(_foo);        

  },



  flip_12(f_n) {

    if (f_n == 1)
      return (2);
    else if (f_n == 2)
      return (1);

  },

  //element html
  flip_image(f_image, f_modo = 'x') {

    let _can = DUMMY_CANVAS.set(f_image.width, f_image.height);
    _ctx = _can.getContext('2d');


    if (f_modo == 'x') {
      _ctx.scale(-1, 1);
      _ctx.drawImage(f_image, -f_image.width, 0);
    }
    if (f_modo == 'y') {
      _ctx.scale(1, -1);
      _ctx.drawImage(f_image, 0, -f_image.height);
    }

    let _dataurl = _can.toDataURL('PNG');

    let _img_horneada = document.createElement('img');

    _img_horneada.src = _dataurl;

    //_img_horneada.onload=function()
    // {
    //  can.ctx.drawImage(this,-100,0);
    // }
    return (_img_horneada);

  },



  //C:\fakepath\archivo (4).png          
  //<- texto, filename
  get_filename_from_url(f_url) {

    let _filename = "";

    for (var i = f_url.length; i > 0; i--) {
      let _u = f_url.charAt(i);
      if (_u != '\\' && _u != '/') {
        _filename = _u + _filename;
      }
      else {

        break;
      }

    }

    return (_filename);

  },


  style_obj_to_tag(f_obj) {
    //"border:1px solid red"
    let _str = '"';
    for (var inom in f_obj) {
      let u = f_obj[inom];
      let _type = get_type(u);

      let _inom = "";
      for (var i of inom) {
        if (i.toUpperCase() == i) {
          i = "-" + i.toLowerCase();

        }
        _inom += i;
      }


      if (_type == 'string' || _type == 'number') {
        _str += _inom + ": " + u + "; ";
      }

    }
    _str = _str.slice(0, -1);
    _str += '"';

    return (_str);

  },



  temp_32view(f_w, f_h, f_img) {
    let _data = setloop_prop(
      {
        w: 10,
        h: 10,
        img: "",
      },
      {
        w: f_w,
        h: f_h,
        img: f_img,
      }
    );


    let _canvas = document.createElement('canvas');
    let _ctx = _canvas.getContext('2d');
    _canvas.width = _data.w;
    _canvas.height = _data.h;

    if (_data.img !== "") {
      _ctx.drawImage(_data.img, 0, 0);

    }

    let _a = _ctx.getImageData(0, 0, _data.w, _data.h)


    return (new Uint32Array(_a.data.buffer));



  },



  //nuevo_form
  _FORM:
  {

    crear_text(f_donde, f_data={})
    {

      let _data = setloop_prop(
                              {
                               x:0,
                               y:0,
                               w:100,
                               h:20,
                               texto:'_',
                               odiv:'',
                               set_text(f_text=this.texto)
                               {
                                this.odiv.obj.innerHTML = f_text;

                               },
                               style:
                                 {
                                   border:'1px solid red',
                                   textAlign:'center',
                                   background:'none',
                                   whiteSpace:'nowrap',

                                 },

                                 ini()
                                 {
                                    let _odiv = this.odiv = crear_odiv(f_donde, this.x, this.y, this.w, this.h, this.style);
                                    this.set_text(this.texto);


                                 }
                              },
                               f_data
                              )

          _data.ini();


       return(_data);

    },
   
    crear_input(f_donde, f_data={})
    {
        let _data = setloop_prop(
                                  {
                                   x:0,
                                   y:0,
                                   w:100,
                                   h:20,
                                   on_enter(){},
                                   outline:'none', //borde focus
                                   max_char: 10,
                                   multiline:0,
                                   paste:1,
                                   oinput:'', 
                                   set_value(f_string='')
                                   {
                                     this.oinput.obj.value = f_string;
                                   },
                                   get_value()
                                   {
                                    return (this.oinput.obj.value);
                                   },
                                      
                                   ini()
                                   {
                                      //fix dimensiones inexactas input
                                      if(get_type(this.h)=='number' )this.h-=5;
                                      if(get_type(this.h)=='array' )this.h[1]+=5;
                                      if(get_type(this.w)=='number' )this.w-=5;
                                      if(get_type(this.w)=='array' )this.w[1]+=5;

                                      let _input = this.oinput = crear_odiv_hueco(this.x, this.y, this.w, this.h);
                                          _input.obj = crear('textarea', f_donde.obj);
                                          _input.obj.style.outline= this.outline;
                                          _input.obj.maxLength    = this.max_char;


                                      _input.padre = f_donde;
                                      _input.obj.style.position = 'absolute';
                                      

                                      _input.obj.style.resize   = "none"; // true = 'both'
                                      _input.update();

                                      if(this.paste==0) //evitar pegar texto
                                      {
                                          _input.obj.onpaste = function (e) 
                                          {
                                          e.preventDefault();
                                          }
                                      }

                                     _input.obj.onkeydown = (e)=>
                                     {
                                        if (e.key == "Enter") 
                                        {
                                          
                                          this.on_enter();

                                          if(this.multiline==0)
                                          e.preventDefault();

                                        }

                                      }

                                      
                                     if(f_data.value!==undefined)
                                     {
                                      this.set_value(f_data.value.toString());
                                     }

                                     
                                      return (_input);

                                   },

                                  },
                                  f_data
                                );

      _data.ini();


      return(_data);

    },


    //{mousedown=>al hacer click}
    crear_boton(f_donde, f_data={})
    {

       let _data = setloop_prop(
                               {
                                  _padre:f_donde,
                                  odiv:'',
                                  x:0,
                                  y:0,
                                  w:100,
                                  h:25,

                                  texto:'',
                                  styles:[{
                                            background:'none',
                                            border:'1px solid black',
                                            textAlign:'center',
                                          },
                                          {
                                            background:'lightgray',
                                            border:'1px solid black',
                                          }
                                         ],
                                   
                                  mousedown()
                                  {
                                     

                                  },

                                  _mousedown()
                                  {

                                     this.mousedown();

                                  },

                                  mouseenter()
                                  {
                                    this.odiv.set_style(this.styles[1]);

                                  },
                                  mouseleave()
                                  {
                                    this.odiv.set_style(this.styles[0]);

                                  },

                                  ini()
                                  {
                                     this.odiv = crear_odiv(f_donde, this.x, this.y, this.w, this.h, this.styles[0]);
                                     this.odiv.obj.innerHTML = this.texto;
                                     this.odiv.obj.addEventListener('pointerenter', bindear_(this.mouseenter, this) );
                                     this.odiv.obj.addEventListener('pointerleave', bindear_(this.mouseleave, this) );
                                     this.odiv.obj.addEventListener('pointerdown', bindear_(this._mousedown, this) );


                                  }
                               },
                               f_data

                               )

          _data.ini();

       return(_data);

    },


   crear_categoria(f_donde, f_data={})
   {
    //atajos
    if(f_data.texto)
    {
      if(!f_data.titulo)f_data.titulo={texto:f_data.texto};
      else f_data.titulo = f_data.texto;
    }


    let _data = setloop_prop(
                    {
                     odiv:'',
                     x:0,
                     y:0,
                     w:100,
                     h:100,
                     style:{background:f_donde.obj.style.background, border: '1px solid gray', overflow:'visible'},
                     titulo:{
                            odiv:'',
                            x:5,
                            y:-10,
                            h:20,
                            style:{background:f_donde.obj.style.background, border:'none', paddingLeft:'5px'},
                            texto:'abc',
                            },
                     set_title(f_title='')
                     {
                     
                     this.titulo.texto = f_title;
                     this.titulo.odiv.set_html_maxwidth(f_title,5);
                     },
                     ini()
                     {
                      this.odiv        = crear_odiv(f_donde, this.x, this.y, this.w, this.h, this.style);                
                      this.titulo.odiv = crear_odiv(this.odiv, this.titulo.x, this.titulo.y, this.titulo.w, this.titulo.h, this.titulo.style);                
                      this.set_title(this.titulo.texto);
                       
                     },
                    },
                     f_data);
                
          _data.ini();


          return(_data);

   },//crear_categoria



  },



  //|forms

  FORMS: //botoenes, etc...
  {

    crear_textarea(f_donde, f_x, f_y, f_w, f_h, f_style) {
      let _data = setloop_prop(
        {
          x: 0,
          y: 0,
          w: 100,
          h: 100,
        },
        {
          x: f_x,
          y: f_y,
          w: f_w,
          h: f_h,
        }
      );


      let _text = crear_odiv_hueco(_data.x, _data.y, _data.w, _data.h);

      _text.obj = crear('textarea', f_donde.obj);


      _text.padre = f_donde;
      _text.obj.style.position = 'absolute';
      _text.obj.style.left = _data.x + "px";
      _text.obj.style.top  = _data.y + "px";

      _text.obj.style.width  = _data.w +'px';
      _text.obj.style.height = _data.h + "px";
      
      _text.obj.style.resize = "none"; // true = 'both'


      set_style(_text.obj, f_style);

      return (_text);

    },



    cargar_imagen(f_callback) {

      FORMS.cargar_fileinput({ accept: 'image', type: 'file' }, function (e) {

        let _image_url = URL.createObjectURL(e.target.files[0]);

        var _im = document.createElement('img');
        _im.src = _image_url;
        _im.is_blob = 1;

        let _value = e.srcElement.value;

        _im.filename = get_filename_from_url(_value);


        _im.onload = function () {
          f_callback(_im);

        }



      })

    },



    //<-
    //(texto, filename)
    cargar_txt(f_callback, f_accept= 'image') {



      FORMS.cargar_fileinput({ accept: f_accept, type: 'file' }, function (e) {


        let _txt = e.target.files[0];

        let _fr = new FileReader();
        _fr.onload = function () {


          f_callback(this.result, get_filename_from_url(e.srcElement.value));

        }
        //    fr.onloadend = function() {

        _fr.readAsText(_txt);



      })

    },

    cargar_wav_buffer(f_callback, f_accept= 'image') {


      FORMS.cargar_fileinput({ accept: f_accept, type: 'file' }, function (e) {

              let _reader = new FileReader();
              _reader.onload = function(){

                  let _arrayBuffer = _reader.result;
                  
                  
                 // f_callback(_arrayBuffer)
                  AUDIO.ctx.decodeAudioData(_arrayBuffer, f_callback);

                };

                _reader.readAsArrayBuffer(e.target.files[0]);





      })

    },




    cargar_fileinput(f_data, f_alcargar) {

      let _data = setloop_prop(
        {
          accept: 'image',
          type:   'file',
         // file_extension:'.jpg',
        },
        f_data
      );



      var _foo = miscrear_odiv(_root, "input", -100, 0, 10, 10);

      _foo.obj.accept = _data.accept;
      _foo.obj.type = _data.type;
      //_foo.obj.file_extension = _data.file_extension;

      _foo.obj.style.background = "green";


      _foo.obj.click();

      _foo.obj.onchange = f_alcargar;


    },

    crear_fileinput(f_donde, f_data, f_alcargar) {

      let _data = setloop_prop(
        {
          x: 0,
          y: 0,
          w: 100,
          h: 100,

          accept: 'image',
          type: 'file',
          style: {},
        },
        f_data
      )

      let _foo = crear_odiv(f_donde, _data.x, _data.y, _data.w, _data.h, _data.style);

      _foo.odiv_input = miscrear_odiv(_foo, "input", 0, 0, _foo.wr, _foo.hr);
      let _zoo = _foo.odiv_input;
      _zoo.obj.accept = _data.accept;
      _zoo.obj.type = _data.type;
      _zoo.obj.style.background = "green";
      _zoo.obj.style.opacity = "0";

      _zoo.obj.onchange = f_alcargar;

      return (_foo);
    },





  },


  to_obj_array(f_, f_propname) {
    let _type = get_type(f_);
    if (_type == 'array') {
      for (var i = 0; i < f_.length; i++) {
        let _u = f_[i];
        let _fob = {};
        _fob[f_propname] = _u;
        f_[i] = _fob;

      }
      return (f_)
    }

    else {
      let _fob = {};
      _fob[f_propname] = f_;
      return ([_fob]);
    }

  },



  to_array(f_) {
    let _type = get_type(f_);
    if (_type == 'array') {
      return (f_)
    }

    else {
      return ([f_]);
    }

  },


  snap_floor(f_n, f_div) {
    return (Math.floor(f_n / f_div) * f_div)

  },

  snap_round(f_n, f_div) {
    return (Math.round(f_n / f_div) * f_div)

  },



  get_minmax(f_arr) {
    let _min = f_arr[0];
    let _max = f_arr[0];
    let _min_i = 0;
    let _max_i = 0;

    for (var i = 0; i < f_arr.length; i++) {
      let u = f_arr[i];

      if (u < _min) {
        _min = u;
        _min_i = i;
      }
      if (u > _max) {
        _max = u;
        _max_i = i;
      }


    }

    return ({

      min:
      {
        n: _min,
        i: _min_i,
      },

      max:
      {
        n: _max,
        i: _max_i,
      }


    })

  },


  //  func_from_array([jiji, jiji], "argumento_a","argumento_b","argumento_c");
  //              mismos argumentos para toda funcion
  //  (f_arr,   argumento_a, argumento_b, argumento_c ...)
  func_from_array(f_arr) {

    _args = [];
    if (arguments.length > 1) {
      for (var i = 1; i < arguments.length; i++) {
        let u = arguments[i];
        _args.push(u);
      }
    }


    let _type = get_type(f_arr);
    if (_type == 'function') {
      f_arr(..._args);
    }

    if (_type == 'array') {
      for (var u of f_arr) {
        u(..._args);
      }
    }


  },


  pushconvert_in_arr(f_donde, f_data) {
    let _type = get_type(f_donde);
    if (_type == 'array') {
      f_donde.push(f_data);
    }
    else {
      f_donde = [f_donde];
      f_donde.push(f_data);
    }

    return (f_donde);
  },




  mix_string(f_string, f_new_string, f_index) {


    return (f_string.substring(0, f_index) + f_new_string + f_string.substr(f_index))

  },

  //n +sumar  -quitar

  extend_multiarray(f_arr, f_data) {

    let _data = setloop_prop(
      {
        izq: 0,
        arr: 0,
        der: 0,
        aba: 0,
      },
      f_data
    )

    let _izq = _data.izq;
    let _arr = _data.arr;
    let _der = _data.der;
    let _aba = _data.aba;


    if (_arr > 0) {

      for (var n = 0; n < _arr; n++) {
        let _fila = new_array(f_arr[0].length, 0);
        f_arr.splice(0, 0, _fila);
      }

    }
    if (_arr < 0) {

      f_arr.splice(0, Math.abs(_arr));

    }


    if (_aba > 0) {

      for (var n = 0; n < _aba; n++) {
        let _fila = new_array(f_arr[f_arr.length - 1].length, 0);

        f_arr.push(_fila);
      }
    }

    if (_aba < 0) {

      f_arr.splice(-Math.abs(_aba), Math.abs(_aba));

    }


    if (_izq > 0) {

      for (var n = 0; n < _izq; n++) {
        for (var i = 0; i < f_arr.length; i++) {
          f_arr[i].splice(0, 0, 0);
        }
      }


    }


    if (_izq < 0) {

      for (var n = 0; n < Math.abs(_izq); n++) {
        for (var i = 0; i < f_arr.length; i++) {
          f_arr[i].splice(0, 1);
        }
      }

    }



    if (_der > 0) {
      for (var n = 0; n < _der; n++) {

        for (var i = 0; i < f_arr.length; i++) {
          f_arr[i].push(0);
        }
      }
    }

    if (_der < 0) {

      for (var i = 0; i < f_arr.length; i++) {
        f_arr[i].splice(-Math.abs(_der), Math.abs(_der));
      }
    }




  },

  //[]
  extend_multiarrays(f_arr, f_dir) {

    for (var u of f_arr) {

      extend_multiarray(u, f_dir);
    }

  },


  new_array(f_length, f_data = "") {

    let _arr = [];
    for (var i = 0; i < f_length; i++) {
      _arr.push(f_data);
    }

    return (_arr)

  },



  eval_in_scope(f_js, f_context) {

    //    return function() { with(this) { return eval(f_js); }; }.call(f_context);

    var result = function (str) {
      return eval(str);
    }.call(f_context, f_js);

  },





  //[var, var]
  _if(f_val, f_ret) {
    if (f_val[0] == f_val[1]) {
      return (f_ret)
    }
    return (0);
  },



  loopy(func_a, func_b) {

    function _loopyfoo() {

      if (func_a() == 1) {
        func_b();

      }

      else {
        window.requestAnimationFrame(_loopyfoo);
      }

    }


    _loopyfoo();


  },


  //argumentos abiertos
  find_last_1() //en iteracion, retorna i ultimo que'es 1
  {
    i = 0;
    let _end = 'nada';
    for (var u of arguments) {

      if (u == 1) {
        _end = i;
        //return(i);
      }

      i++;
    }

    return (_end)


  },


  //[n,n]
  flip_arr(f_arr) {

    let _a = f_arr[0];
    let _b = f_arr[1];

    return ([_b, _a]);

  },

  flipbin(f_n) {

    if (f_n == 0)

      return (1);

    else

      return (0);


  },


  index_of_all(f_a, f_b) //regresa array con indices
  {

    let _arr = [];

    var _ind = f_a.indexOf(f_b, 0);
    while (_ind !== (-1)) {
      _arr.push(_ind);

      _ind = f_a.indexOf(f_b, _ind + 1);
    }

    return (_arr)


  },



  //|cookie
  cookies:
  {
    //dias futuros
    set(_a, _b, _expires = 10, _path = "/") {


      let _d = new Date();

      _d.setTime(_d.getTime() + (_expires * 24 * 60 * 60 * 1000));
      _expires = _d.toUTCString()


      document.cookie = _a + "=" + _b + ";" +
        "expires=" + _expires + ";" +

        "path=" + _path;

    },

    get(_a) {


      let _arr = (decodeURIComponent(document.cookie).split(';'))

      for (var u of _arr) {
        let _co = u.split("=");

        if (_co.length == 2 && _a == _co[0].replaceAll(" ", "")) {
          return (_co[1])
        }


      }



    },

  },//cookies

  super_stringify(_obj) {

    _obj = JSON.stringify(_obj, function (_key, _value) {

      if (get_type(_value) == 'function')
        return ('[FUNCTION]' + _value.toString())

      return (_value)
    }

    )

    return (_obj)

  },

  super_parse(_string) {


    let _obj = JSON.parse(_string, function (_key, _value) {
      //adaptar funcion en string
      if (get_type(_value) == 'string' && _value.startsWith('[FUNCTION]')) {
        let _fun = _value.slice(10);

        let _end = eval('( function ' + _fun + ')');

        return (_end)

      }

      return (_value)

    }

    );

    return (_obj)

  },



  //        url o codigo (si codigo -definir-> loadfile:0 )
  //           |
  cargar_app(f_donde, f_url, f_data, f_callback) {

    let _data = setloop_prop(
      {
        load_file: 1, //1 = cargar_txt || 0 = ejecutar string directamente 

        vars: {},  //ref variables en ventana creada   -> this.vars
        ven: {},  //propiedades a ventana creada
      },

      f_data

    );

    let _runcode = (e) => {
      let _code = (e.slice(e.indexOf('"eval":') + 6));
      let _index = index_of_all(_code, '"');
      if (_index.length >= 2)
        _code = _code.slice(_index[0] + 1, _index[1])



      e = JSON.parse(remove_linebreak(e));

      e.eval = _code;



      //eval'uar 'menu' si su formato es string (se asume '{a:{}...  }' ')
      if (e.window && e.window.menu && get_type(e.window.menu) == 'string')
        e.window.menu = eval("(" + e.window.menu + ")");


      let _win = e.window; //propiedades ventana definidad en archivo

      let _ventana = ventana.crear_ventana(f_donde, { ..._win, ..._data.ven })
      _ventana.vars = {};

      setloop_prop(_ventana.vars, _data.vars);

      eval_in_scope(e.eval, _ventana);

      if (f_callback)
        f_callback(_ventana);


    }

    if (_data.load_file)
      cargar_txt(f_url, _runcode, 0)//0->respuesta cruda

    else
      _runcode(f_url);

  },





  //ajax cargar php
  //                  {nombre:"Calamar", b:2, c:3},
  //                    |
  enviar_post(f_url, f_post, f_callback, f_header = "application/x-www-form-urlencoded") {

    var _xhr = new XMLHttpRequest();

    _xhr.onreadystatechange = function () { //tras pagina executada
      if (_xhr.readyState === 4 && _xhr.status === 200) {  //no error

        let _string_original = _xhr.responseText;

        let _json = "";

        let _EVAL = get_tag(_string_original, 'EVAL');

        if (_EVAL) //si echo de php inicia con EVAL , se ejecuta como js despues de eliminar caracteres EVAL; 
        {
          eval(_EVAL.texto);

          _string_original = _EVAL.original_cortado;
        }


        let _JSON = get_tag(_string_original, 'JSON');


        if (_JSON) {
          _json = JSON.parse(_JSON.texto);

          _string_original = _JSON.original_cortado;

        }


        if (f_callback !== undefined) {


          f_callback(_string_original, _json);
        }


      }

    }; // end onreadystatechange


    _xhr.open('POST', f_url);

    //  _xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    _xhr.setRequestHeader("Content-Type", f_header);

    //_xhr.setRequestHeader('Content-Type', 'multipart/form-data');


    let _send_string = "";

    //convertir obj post a string
    //  _xhr.send('nombre=' + _woo + ' & dada=123');

    if (get_type(f_post) == 'object') {
      let _f_post_length = Object.keys(f_post).length;
      let _i = 0;
      for (var i in f_post) {
        let _u = f_post[i];

        _send_string += i + "=" + _u;

        if (_i < _f_post_length - 1) {
          _send_string = _send_string + "&";
        }
        _i++;
      }
    }
    //fin conversion

    _xhr.send(_send_string);

  },




  find_array_html_maxwidth(f_arr, f_style) {
    let _foo = crear_odiv(_root, 0, 0, 0, 10, f_style);
    let _wmax = 0;
    for (var i in f_arr) {
      _foo.set_html_maxwidth(i);
      if (_foo.wr > _wmax) {
        _wmax = _foo.wr;
      }
    }
    _foo.remove();
    return (_wmax);
  },



  radians_to_degrees(f_radians) {
    let _pi = Math.PI;
    return (f_radians * (180 / _pi));
  },


  cuotear(f_string) {

    if (f_string == "") {
      return ("");
    }
    return ("'" + f_string + "'");

  },


  remove_obj_from_array(f_object, f_array) {

    for (var i = 0; i < f_array.length; i++) {
      if (f_array[i] == f_object) {
        f_array.splice(i, 1);
        break;
      }
    }

  },


  remove_linebreak(f_string) {
    //return(f_string.replace(/(\r\n|\r|\n)/g, ''));

    return (f_string.replace(/(\r\n|\r|\n|\t)/g, ''));

  },


  //|graficos

  get_line(x, y, xx, yy) {

  },



  //imagedata primitivo, NO imagedata.imagedata
  //           |
  imagedata_pintar_cua(f_imagedata, f_x, f_y, f_w, f_h, f_color, f_update = 0) {
    let x = f_x;
    let _x = f_x + f_w;

    let y = f_y;
    let _y = f_y + f_h;


    for (var a = x; a < _x; a++) {
      for (var b = y; b < _y; b++) {

        if (a >= 0 && a < f_imagedata.imagedata.width &&
          b >= 0 && b < f_imagedata.imagedata.height) {
          f_imagedata.view32[(b * f_imagedata.imagedata.width) + a] = f_color;
        }
      }
    }

    if (f_update == 1) {

      f_imagedata.update();
    }
  },




  addEventListener_mousedown_touchstart(f_donde, f_func, f_bubble) {

    if (IS_MOBILE) {
      f_donde.addEventListener('touchstart', f_func, f_bubble);
    }
    else {
      f_donde.addEventListener('mousedown', f_func, f_bubble);
    }

  },

  addEventListener_mouseup_touchend(f_donde, f_func, f_bubble) {

    if (IS_MOBILE) {
      f_donde.addEventListener('touchend', f_func, f_bubble);
    }
    else {
      f_donde.addEventListener('mouseup', f_func, f_bubble);
    }

  },

  addEventListener_mousemove_touchmove(f_donde, f_func, f_bubble) {

    if (IS_MOBILE) {
      f_donde.addEventListener('touchmove', f_func, f_bubble);
    }
    else {
      f_donde.addEventListener('mousemove', f_func, f_bubble);
    }

  },



  exist(f_var, f_prop) //empleado en definicion de objetos
  {
    if (f_var !== undefined && f_var !== null) { return (f_var[f_prop]); }
    return (f_var)
  },





  get_tag(f_string, f_tag, f_chars = ['<', '>']) {

    let _tag_a = f_chars[0] + f_tag + f_chars[1];
    let _tag_b = f_chars[0] + "/" + f_tag + f_chars[1];


    let _a = f_string.indexOf(_tag_a);
    let _az = _a + _tag_a.length;

    let _b = f_string.indexOf(_tag_b, _az);
    let _bz = _b + _tag_b.length;



    if (_a > -1 && _b > -1) {

      return ({
        texto: f_string.slice(_az, _b),
        original: f_string,
        original_cortado: f_string.slice(0, _a) + f_string.slice(_bz),
      })


    }
    else {
      return (0);
    }



  },


  get_alltag(f_string, f_tag) {

    let _end = [];

    let _get = get_tag(f_string, f_tag);
    while (_get !== 0) {

      _end.push(_get);

      _get = get_tag(_get.original_cortado, f_tag);
    }


    if (_end.length == 0) {
      return (0);
    }
    else {
      return ({ tags: _end, original: f_string, original_cortado: _end[_end.length - 1].original_cortado });
    }

  },




  //transformaciones       
  //                              1 = absoluto
  //                              0 = add
  rotate(cx, cy, x, y, angle, f_abs = 1) {

    if (f_abs) {

      let _angle = (angle360(cx, cy, x, y));

      let _r = rotate(cx, cy, x, y, _angle, 0);

      x = _r[0];
      y = _r[1];
    }

    var radians = (Math.PI / 180) * angle,
      cos = Math.cos(radians),
      sin = Math.sin(radians),


      nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
      ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;



    return [nx, ny];
  },

  angle(cx, cy, ex, ey) {
    var dy = ey - cy;
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    return theta;
  },
  angle360(cx, cy, ex, ey) {
    var theta = angle(cx, cy, ex, ey); // range (-180, 180]
    if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
  },



  move_by_degrees(f_x, f_y, degrees, dis) {
    var radians = degrees * (Math.PI / 180);
    f_x += Math.cos(radians) * dis;
    f_y += Math.sin(radians) * dis;
    return ({ x: f_x, y: f_y })
  },




  //coonvertir document.body en odiv
  ini_root(f_obj) {
    if (f_obj == undefined) {
      document.body = document.createElement("body");

      document.body.style.overflow = 'hidden';
      document.body.style.margin = "0px";
      //document.body.style.height= "100%";
      document.body.style.minHeight = "100vh";
      f_obj = document.body;

      //evitar scroll adressbar en android chrome
      document.body.style.position = "fixed";


    }


    ini_dummy_canvas(); //canvas dummy (rotacion, etc...)


    let _dummy = crear_odiv_hueco(0, 0, 10, 10)
    window['_root'] = {
      obj: f_obj,
      hijos: [],
      hijos_clip: [],
      update_hijos_depth: _dummy.update_hijos_depth,
      modulos_enterframe: [],
      _is: "root",
      is_root: 1,
      $: [],

      get_borde() { return ([0, 0, 0, 0]) },

      get_global() {
        return ({ x: 0, y: 0 });
      },

      locked: { unlock() { }, },



      set_$(f_donde) {
        if (f_donde == undefined) {
          alert('undefined');
        }
        if (f_donde.$ !== undefined && Object.keys(f_donde.$).length != 0) {
          for (var j in f_donde.$) {
            window["$" + j] = f_donde.$[j];

          }
        }

      },

    };

    _root.obj.odiv = _root;


  },

}







//|MOBILE
//referencia sencilla is_mobile
_BASICO.IS_MOBILE = (_BASICO.detect_mobile() != null);

_BASICO.mousedown_touchstart = "mousedown";
_BASICO.mouseup_touchend = "mouseup";
_BASICO.mousemove_touchmove = "mousemove";

_BASICO.onmousedown_ontouchstart = "onmousedown";
_BASICO.onmouseup_ontouchend = "onmouseup";
_BASICO.onmousemove_ontouchmove = "onmousemove";

if (_BASICO.IS_MOBILE) {
  _BASICO.mousedown_touchstart = "touchstart";
  _BASICO.mouseup_touchend = "touchend";
  _BASICO.mousemove_touchmove = "touchmove";

  _BASICO.onmousedown_ontouchstart = "ontouchstart";
  _BASICO.onmouseup_ontouchend = "ontouchend";
  _BASICO.onmousemove_ontouchmove = "ontouchmove";


}






//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!![ REFERENCIA SENCILLA A FUNCIONES]
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

for (var i in _BASICO) { window[i] = _BASICO[i]; }
