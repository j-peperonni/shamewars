//funciones auxiliares demasiado prolongadas como para ponerlas en el archivo principal [watons.php]

//'trasplantado' desde proyecto 'adventure'
//recorrer en su totalidad un array
function _loop_in_array(f_arr, f_func = undefined) {

  function _rec(_arr, _inobj = 0) {
    for (var i = 0; i < _arr.length; i++) {
      let u = _arr[i];
      let _type = get_type(u);

      if (_type !== 'array' && _type !== 'object') 
        f_func(u, i, _arr, _inobj);
      
      if (_type == 'array') 
        _rec(u);
      

      if (_type == 'object') {

        _rec(Object.keys(u), u);
        _rec(Object.values(u));
      }

    }

  }

  _rec(f_arr);


  return (f_arr);


}



function z_set(f_donde)
{


                  f_donde.sort(function(a,b){
                                       
                                         if(a._z==undefined)
                                           a._z=0;
                                         
                                         if(b._z==undefined)
                                           b._z=0;
                                         
                                          if(a._z<b._z)
                                            return(-1)
                                          
                                          if(a._z>b._z)
                                            return(1)
                                          
                                          return(0)
                    })
  

}



var RPG =
{

  
 check_charmax()
 {

 },

 //objeto img
 crear_img_texto(f_data={})
 {

	let _data =
	  	           {
	                ...{
	                   image:$LIB.IMAGES[16],
	                   canvas:DUMMY_CANVAS,
	                   texto:'A',
	                   x:0,
	                   y:0,
	                   w:[1,1], //tile
	                   h:[1,1], //tile
                     max_char:1000,
                     x_centrar:1,

	                   },
	                ...f_data
	  	           }
	  	           
	let  _texto = _data.texto + '';

   let c;

   let _words = [ ];

   let _word = '';
   let _x = 0;
   let _xx = 0;
   let _wmax = 0;
   for(var i =0; i<_texto.length;i++)
   {
       c = _texto.charAt(i);
       _xx=0;
       if(i>0 && _texto.charAt(i-1)===" ")
       {
        for(var j = i; j<_texto.length;j++)
        {

          let _c = _texto.charAt(j);

          if(_x+_xx>_data.max_char)
          {
          if(_word.length>_wmax) _wmax=_word.length-1;
           _word = _word.slice(0,_word.length-1);
           _words.push(_word);
           _word = "";
           _x=0;
           _xx=0;
           break;
          }
          if(_c == ' ') break;
          _xx++;
        }
       }

       _word += c;      
       _x++;
   }

   if(_word.length>_wmax) _wmax=_word.length;
   _words.push(_word);


  let _wtotal = _wmax * _data.w[1];
  let _htotal = _words.length  * _data.h[1];

	     _data.canvas.set(_wtotal, _htotal);


      for(var k in _words)
      {
        for(var i =0;i<_words[k].length; i++)
        {
         let u = _words[k].charAt(i);

             draw_letra({
                    canvas: _data.canvas,
                    img: _data.image,
                    char: u,

                    y: _data.h[1]*k,
                    x: _data.w[1]*i,
                    w: _data.w,
                    h: _data.h,
                  })

        }
      }

	     
	           
	      let _img = document.createElement('img');
	          _img.src = _data.canvas.toDataURL();
            _img.w = _wtotal;
            _img.h = _htotal;

         return(_img);


 },


  //o_texto
  crear_texto(f_donde, _data={})
  {

   let _img = RPG.crear_img_texto(_data);   


   let _otexto =  _data.gameges.crear_imagen(f_donde, 
                                             _img, _data.canvas_id,
                                            {
                                           x:_data.x,y:_data.y,
                                           w: _img.w, 
                                           h: _img.h,
                                           xg:_data.xg,//usado al redimensionar botones
                                           yg:_data.yg,//usado al redimensionar botones
                                           _onload:_data._onload,
                                           enterframe:_data.enterframe,
                                         
                                             //w:0,
                                             //h:0
                                           }); 
   if(_otexto._onload!==undefined)
    _otexto._onload();
   

       _otexto.data_text = _data;


       _otexto.set_font = function(f_img)
       {
        this.data_text.image = f_img;
        this.set_text(this.data_text.texto);
       }

       _otexto.set_text=function(f_texto)
       {
         let _img = RPG.crear_img_texto({
         	                            ...this.data_text,
         	                            ...{
         	                            	texto:f_texto
         	                               }
         	                             });
         _img.onload=()=>{
         this.w = _img.w;           
         this.h = _img.h;           
          this.image = _img;	
          if(this._onload!==undefined)this._onload();

         }
       }

       //_otexto.set_text(_data.texto);

   return(_otexto);
    
  },

  crear_dialogo(f_donde, f_data) {
    let _data = setloop_prop({
      fuente:
      {
        w: [8, 8],
        h: [8, 8],
      },
      x: 0,
      y: 0,
      w: 100,
      h: 100,
      teclado: '',

      style: { background: 'black', borderTop: '2px solid gray' }

    }, f_data)


    let _dialogo = {

      fuente: _data.fuente,
      odiv: '',
      canvas: '',
      buf: '',
      teclado: _data.teclado,


      write:
      {
        _padre: "",

        estado: 0,


        texto: [''],
        texto_copy: "",
        line: "", //linea local  [temporal]
        keys: "", //keys locales [temporal] usadas en estado == 2

        prev: [0, 0], //arr, index (empleado al actualizar line)

        act: [0, 0, 0], //linea, caracter, misc(seleccion_opciones, etc..)
        x: 0,
        y: 0,


        tt: [0, 0],

        ini_speed: [4,0], //al iniciar write
        master_speed: [4, 0], //velocidad master
        speed: [4, 0], //velocidad linea


        reset_speed(to_ini=0) {
          if(to_ini==0)
          this.speed = [this.master_speed[0], this.master_speed[1]]
          else
          {
          this.speed        = [this.ini_speed[0], this.ini_speed[1]];
          this.master_speed = [this.ini_speed[0], this.ini_speed[1]];
          }
          
        },
        yplus: 0,

        margen: [5, 5, 10, 0, 3], //x y x y    entrelineay

        ymax: 4,

        tags: {},

        clips: [],
        clip: "",//clip contenedor dialogo (creado en $root)

        //clips a desbloquear al finalizar dialogo
        set(f_text, f_clips = []) {

          this._padre.clip = $gameges.crear_vacio($root, 2, { nombre: "dialogo", x: 0, y: game.hcanvas - 50, w: $root.w, h: 50, draw_color: "black", });
          $gameges.crear_imagen(this._padre.clip, this._padre.canvas.obj, 2, { nombre: "canvas", x: 0, y: 5, enterframe() { } });


          this.estado = 1;
          //this.estado=f_estado;


          //this._padre.odiv.show();

          this.texto = clone_array(f_text, 1);
          this.texto_copy = clone_array(f_text, 1);
          this.line = "";
          this.keys = "";
          this.prev.fill(0);
          this.clips = f_clips;

          this.act.fill(0);

          this.x = 0;
          this.y = 0;
          this.yplus = 0;

          //identificar tags
          _loop_in_array(this.texto, (_texto, _i, _arr, _dialogo = 0) => {

            for (var i = 0; i < _texto.length; i++) {

              let _c = _texto.charAt(i);

              if (_c == "{") {


                let _json = find_json_from_string(_texto, i);


                for (var j in _json.json) {
                  let u = _json.json[j];
                  if (j == 'id') {
                    let __arr = _arr;
                    if (_dialogo)
                      __arr = _dialogo;
                    this.tags[u] = {
                      arr: __arr,
                      act: [_i, i],

                    };

                    //  this.tags[u]={arr: clone_array(_arr) , act: [_i,i]};
                  }

                }
              }

            }


          }, 1, 0)

          //console.log(this.tags)


        },



        on_end() {
          //this._padre.odiv.hide()
          this.reset_speed(1);//1=regresar a valores speed iniciales [no 'master']
          this.estado = 0;
          this._padre.canvas.clear();
          this._padre.buf.clear();

          this._padre.clip.remove();
          this._padre.clip = '';
          this.scroll_x=0;

          if(this.TIMEOUT_P!==undefined)
          {
           clearTimeout(this.TIMEOUT_P)
           this.TIMEOUT_P=undefined;
          }



          for (var u of this.clips)
            u.on_dialogo_end();

          game.dialogo.on_end();

        },
        run() {

          let _canvas = this._padre.canvas;
          let _bcanvas = this._padre.buf;
          let _teclado = this._padre.teclado;
          let _fuente = this._padre.fuente;
          let _margen = this.margen;
          let _z = _teclado.get('z', 2);
           


          //actualizacion automatica de this.line
          if (this.texto !== this.prev[0] || this.act[0] !== this.prev[1]) {
            this.prev[0] = this.texto;
            this.prev[1] = this.act[0];
            this.line = this.texto[this.act[0]];
            if (get_type(this.line) == 'object') {
              this.keys = Object.keys(this.line);
            }
          }




          let _s = _z; if (_z == 2) _s = 1; this.tt[1] = this.speed[_s];


          if (this.estado == 'scroll_top') {
            let _end = -(_margen[4] * this.y + (this.y + 1) * _fuente.w[1]);

            this.yplus += (_end - this.yplus) / 10;

            if (this.yplus < _end + 1) {
              _bcanvas.clear()

              this.yplus = 0;
              this.x = 0;
              this.y = 0;
              this.act[1] = 0;

              let _texto = this.texto[this.act[0]];
              if (get_type(_texto) == 'string')
                this.estado = 1;

              if (get_type(_texto) == 'object')
                this.estado = 2;

            }

          }

          else if (this.estado == 'wait_act') {
            if (_z == 1 || this.force_z) {
             

              this.reset_speed();

              if (this.act[0] < this.texto.length - 1 || this.force_z) {
                 this.force_z=0;

                this.estado = 'scroll_top';
                this.act[0]++;


              }
              else //fin dialogos
              {

                this.on_end();


              }
            }

          }

          //escritura normal
          
          else if (this.estado == 1) {
            this.tt[0]++;


            block_tt:
            if (this.tt[0] > this.tt[1]) {
              this.tt[0] = 0;

              if (this.act[1] >= this.line.length)
                this.estado = 'wait_act';


              else {

                let _c = this.line.charAt(this.act[1]);

                //|json
                block_c:
                if (_c == "{") {

                  let _json = find_json_from_string(this.line, this.act[1]);
                  
                  let _a = this.line; this.line = _a.slice(0, _json.a)  +  _a.slice(_json.b + 1);



                  for (var i in _json.json) 
                   {
                    let u = _json.json[i];
                    if (i == 'id') 
                    {
                    }

                    if (i == 'goto') {
                      this.texto = this.tags[u].arr;

                      this.act[0] = this.tags[u].act[0];
                      this.act[1] = this.tags[u].act[1];
                      this.x = 0;
                      this.y = 0;
                      if (get_type(this.tags[u].arr) == 'object') {
                        this.texto = [this.texto];
                        this.estado = 2;

                        this.reset_speed();
                      }
                      
                   
                      break block_tt;

                    }
                    if (i == 'speed') { //velocidad dialogo temporal
                   
                      this.speed = u;
                    }

                    if (i == 'm_speed') {//velocidad dialogo macro
                      this.master_speed = u;
                      this.speed=this.master_speed;
                   
                    }

                    if (i == 'script') {//script personalizado (ejecutar via 'eval')
                      //let _eval = eval(u);        
                      let _eval = Function(u)();        
                      
                      if(_eval==undefined) _eval = "";

                      this.line = this.line.slice(0,this.act[1]) + _eval + this.line.slice(this.act[1]);
                      
                    }

                    if (i == 'next') { //ir al siguiente parrafo
                      this.force_z=1;                      
                      this.estado='wait_act';
                      break block_tt;
                    }
                    if(i=='pause') //en milisegundos
                    {
                    this.estado='paused';
                    this.TIMEOUT_P = setTimeout(()=>{
                                     
                                                  this.estado=1;

                                                 },u)
                    }

                  }
                 
                  _c = this.line.charAt(this.act[1]);

                }//json


                //quebrar linea 
                let _lin = this.line;
                var choo = 0;

                if (this.act[1] > 0 && _lin.charAt(this.act[1] - 1) === " ") 
                {
                  
                  for (let i = this.act[1]; i <= _lin.length; i++) 
                  {



                      if(_lin.charAt(i)==='{')
                      {

                         _json = find_json_from_string(_lin, i);

                         let _a = _lin;

                         _lin = _a.slice(0, _json.a)  +  _a.slice(_json.b + 1);


                        
                      }

                      let _len = i - this.act[1];
                      if (
                         //i == this.line.length || 
                         (_margen[0] +  (this.x + _len)* 8)  >  game.wcanvas //- _margen[2]  

                        ) 
                      {
                        
                        this.x = 0;
                        this.y++;
                        break;
                      }

                      if(_lin.charAt(i) === " " || i ==this.line.length)
                      {

                        break;
                      }
   

                  }
                }//fin quiebre

                if(this.estado=='paused')
                  break block_tt;

                if(_c!== " ")
                {
                if(this.char_snd_bin==undefined)this.char_snd_bin=0;
                this.char_snd_bin= swap_bin(this.char_snd_bin);
                if(this.char_snd_bin)
                      game.soundcon.play(19);  

                }
                

                draw_letra({
                  canvas: this._padre.buf, img: _fuente.img,
                  char: _c,
                  x: this.x * 8,
                  y: this.y * 8 + _margen[4] * this.y,
                  w: _fuente.w,
                  h: _fuente.h,
                })
                this.x++;

                this.act[1]++;

              }

            }


          }//estado==1

          //multiples opciones
          else if (this.estado == 2) {

            if (_teclado.get('aba', 2) == 1) {
              
              if (this.act[2] < Object.keys(this.line).length - 1)
              {
                game.soundcon.play(11);  
                this.act[2]++;
              }
            }
            if (_teclado.get('arr', 2) == 1) {
              
              if (this.act[2] > 0)
              {
                game.soundcon.play(11);  
                this.act[2]--;
              }
            }


            
            

            this.x = 0;
            this.y = 0;
            _bcanvas.clear()
            if (this.scroll_x == undefined)
              this.scroll_x = 0;

            let _yend = 0;
            if (this.act[2] >= this.ymax - 1) {
              let _n = (this.ymax - (this.act[2] + 1));
              _yend = _n * _fuente.h[1] + _margen[4] * _n;

            }
            this.yplus += (_yend - this.yplus) / 5;

            for (var i = 0; i < Object.keys(this.line).length; i++) {
              let _granword = (this.keys[i].length * 8 > this._padre.odiv.wr / 2);

              this.x = 0;
              let _scroll_x = 0;
              if (this.act2_prev !== this.act[2]) {
                this.scroll_x = 0;
              }

              if (this.y == this.act[2]) {
                if (_granword) {
                  if (
                    this.keys[i].length * 8 + this.scroll_x + _margen[0] + _margen[2] > this._padre.odiv.wr / 2)
                  {
                    if(!_teclado.get('izq')&&!_teclado.get('der'))
                    this.scroll_x -= 0.4;

                    if (_teclado.get('der')) 
                    {
                    this.scroll_x -=1;
                    }
                    if (_teclado.get('izq')) 
                    {
                    this.scroll_x +=1;
                    if(this.scroll_x>0)this.scroll_x=0;
                    }


                  }
                  else
                  {
                    if (_teclado.get('izq')) 
                    {
                    this.scroll_x +=1;
                    if(this.scroll_x>0)this.scroll_x=0;
                    }                    
                  }

                    
                }
                else
                {
                  this.scroll_x += (5 - this.scroll_x) / 5;
                }


                _scroll_x = this.scroll_x;


              }

              //this.keys (variables temporales) definidas al inicio de run     
              for (var u = 0; u < this.keys[i].length; u++) {
                let _c = this.keys[i].charAt(u);

                if (_c == "{") {
                  let _json = find_json_from_string(this.keys[i], u);

                  this.keys[i] = this.keys[i].slice(0, _json.a) + this.keys[i].slice(_json.b + 1);

                }

                draw_letra({
                  canvas: this._padre.buf, img: _fuente.img,
                  char: _c,
                  x: fl(this.x * 8 + _scroll_x),
                  y: fl(this.y * 8 + _margen[4] * this.y),
                  w: _fuente.w,
                  h: _fuente.h,
                })
                this.x++;
              }
              this.y++;
              this.act2_prev = this.act[2];

            }

            if (_z == 1) {

              game.soundcon.play(12);                
              this.estado = "scroll_top";
              this.y = Object.keys(this.line).length - 1;

              let _key = (Object.keys(this.line)[this.act[2]]);
              let _value = this.line[_key];

              this.texto = _value;
              delete this.line[_key];



              this.act[0] = 0;
              this.act[1] = 0;
              this.act[2] = 0;
            }

          }


          if ((this.estado == 1 || this.estado == "wait_act") && this.y >= this.ymax)//scroll gradual en nuevalinea
          {
            let _len = this.ymax - this.y + 1;

            let _end = -((this.y - (this.ymax - 1)) * 8 + _margen[4]) * _len;


            this.yplus += (_end - this.yplus) / 10;

            if (this.yplus < _end + 0.3) {
              this.y--;
              this.yplus = 0;
              let _bctx = this._padre.buf.ctx;
              _bctx.globalCompositeOperation = "copy";
              _bctx.drawImage(this._padre.buf.obj, 0, -_fuente.w[1] - _margen[4])
              _bctx.globalCompositeOperation = "source-over";

            }


          }

          _canvas.clear();
          _canvas.ctx.drawImage(this._padre.buf.obj, _margen[0], this.yplus)


        },//run
      },//write

      //|ini dialogo
      ini() {

        this.odiv = crear_odiv(f_donde, _data.x, _data.y, [0, 0], _data.h, _data.style);
        this.canvas = crear_canvas(this.odiv, 2, 0, 0, [0, 0], [5, 0], { background: 'transparent' })

        this.canvas.remove();
        this.odiv.remove();
        //this.odiv.hide();                    

        this.buf = this.canvas.crear_buffer();
        this.teclado.add_keydown(this.keydown)

        //  $gameges.crear_vacio($root, {x:0,y:0, w:$root.nivel.w,h:50, draw_color:"white", visible:false});


      },
      run() {
        if (this.write.estado !== 0)
          this.write.run();

      },

      keydown(e) {
      },

    }
    padrear(_dialogo);
    _dialogo.ini();



    return (_dialogo);

  },



}//RPG



function col_check(_clip, _auto_vel_stop=1) {
    let _x16 = fl(_clip.x / 16);
    let _y16 = fl(_clip.y / 16);

    let _tiledata = $gameges.tileges.tiledata.col;
    let _p = _clip;
    let _ret = [0, 0, 0, 0];

    let _pos = [
      [_clip.x, _clip.y], [_clip.x + _clip.w / 2, _clip.y], [_clip.x + _clip.w, _clip.y],
      [_clip.x, _clip.y + _clip.h / 2], [_clip.x + _clip.w / 2, _clip.y + _clip.h / 2], [_clip.x + _clip.w, _clip.y + _clip.h / 2],
      [_clip.x, _clip.y + _clip.h], [_clip.x + _clip.w / 2, _clip.y + _clip.h], [_clip.x + _clip.w, _clip.y + _clip.h],
    ];

    let _tilemap_1 = $tileges.tilemaps[1];
    let _col = [];
    for (var u of _pos) {
      let _yt = fl((u[1]) / 16);
      let _xt = fl((u[0]) / 16);

      let _tile;
      if (_tilemap_1[_yt] !== undefined)
        _tile = _tilemap_1[_yt][_xt];

      if (_tile > 0) {
        _col.push({
          id: _tile,
          x: _xt * 16,
          y: _yt * 16,
          w: 16,
          h: 16,
          xt: _xt,
          yt: _yt,

        });
      } 
    }

    for (var u of _col) {

      let _udata = _tiledata[u.id];

      //arriba bajo
      if (_p.x + _p.w > u.x && _p.x < u.x + u.w) {

        if (_udata[1] == 1 &&
          (_tilemap_1[u.yt - 1] === undefined || _tilemap_1[u.yt - 1] != undefined &&  //_udata[_tilemap_1[u.yt - 1][u.xt]] != '1,1,1,1' &&
          _tiledata[ _tilemap_1[u.yt - 1][u.xt] ].toString() !== '1,1,1,1') && 

          _p.yprev + _p.h <= u.y + 1 && _p.yvelocity > 0 && _p.y + _p.h > u.y) //colision arriba tile
        {

          /*if(_p.yvelocity>1)
          {
            //game.soundcon.play(19,(_p.yvelocity)/10);
            let _v = (_p.yvelocity)/10;
             if(_v<0.5)_v=0.5;
            game.soundcon.tile_play(u.id,_v);
          }
          */

           

          _p.y = u.y - _p.h;
          _p.yvelocity = 0;
          _ret[1] = u;
        }


        if (_udata[3] == 1 &&
          _tilemap_1[u.yt + 1] !== undefined && //_udata[_tilemap_1[u.yt + 1][u.xt]] != '1,1,1,1' && 
          _tiledata[ _tilemap_1[u.yt + 1][u.xt] ].toString() !== '1,1,1,1' && 
          //_tilemap_1[u.yt + 1][u.xt] ==0 &&

          _p.yprev >= u.y + u.h && _p.yvelocity < 0 && _p.y < u.y + u.h) //colision abajo tile
        {
         
           /*if(_p.yprev > _p.y)
           {
            game.soundcon.tile_play(u.id,-_p.yvelocity/10);
           //game.soundcon.play(19,-_p.yvelocity/10);            
           }
           */


          _p.y = u.y + u.h;

          _p.yvelocity = 0.5;
          _ret[3] = u;
        }

      }


      //izquieda derecha
      if (_p.y < u.y + u.h && _p.y + _p.h > u.y) {
        if (_udata[0] == 1 &&
          _p.xprev + _p.w <= u.x && _p.xvelocity > 0 && _p.x + _p.w > u.x) // colision izquierda tile
        {
          _p.x = u.x - _p.w;
          _p.xvelocity = 0;
          _ret[0] = u;
        }

        if (_udata[2] == 1 &&
          _p.xprev >= u.x + u.w && _p.xvelocity < 0 && _p.x < u.x + u.w) // colosion derecha tile
        {
          _p.x = u.x + u.w;

          _p.xvelocity = 0;
          _ret[2] = u;
        }
      }
    }
    return (_ret);

  }//colcheck


/*
//copiado de col_check de enemigos.js
  function col_check_(_clip, _auto_vel_stop=1) {
    let _x16 = fl(_clip.x / 16);
    let _y16 = fl(_clip.y / 16);

    let _tiledata = $gameges.tileges.tiledata.col;
    let _p = _clip;
    let _ret = [0, 0, 0, 0];

    let _pos = [
      [_clip.x, _clip.y], [_clip.x + _clip.w / 2, _clip.y], [_clip.x + _clip.w, _clip.y],
      [_clip.x, _clip.y + _clip.h / 2], [_clip.x + _clip.w / 2, _clip.y + _clip.h / 2], [_clip.x + _clip.w, _clip.y + _clip.h / 2],
      [_clip.x, _clip.y + _clip.h], [_clip.x + _clip.w / 2, _clip.y + _clip.h], [_clip.x + _clip.w, _clip.y + _clip.h],
    ];

    let _tilemap_1 = $tileges.tilemaps[1];
    let _col = [];
    for (var u of _pos) {
      let _yt = fl((u[1]) / 16);
      let _xt = fl((u[0]) / 16);

      let _tile;
      if (_tilemap_1[_yt] !== undefined)
        _tile = _tilemap_1[_yt][_xt];

      if (_tile > 0) {
        _col.push({
                    id: _tile,
                    x: _xt * 16,
                    y: _yt * 16,
                    w: 16,
                    h: 16,
                    xt: _xt,
                    yt: _yt,

                  });
      }
    }



    for (var u of _col) {

      let _udata = _tiledata[u.id];

      //arriba bajo
      if (_p.x + _p.w > u.x && _p.x < u.x + u.w) {

        if (_udata[1] == 1 &&
          _tilemap_1[u.yt - 1] != undefined && _udata[_tilemap_1[u.yt - 1][u.xt]] != '1,1,1,1' &&
          _p.yprev + _p.h <= u.y + 1 && _p.yvelocity > 0 && _p.y + _p.h > u.y) //colision arriba tile
        {
          _p.y = u.y - _p.h;
          if(_auto_vel_stop)_p.yvelocity = 0;

             _ret[1] = u;
        }


        if (_udata[3] == 1 &&
          _tilemap_1[u.yt + 1] != undefined && _udata[_tilemap_1[u.yt + 1][u.xt]] != '1,1,1,1' &&
          _p.yprev >= u.y + u.h && _p.yvelocity < 0 && _p.y < u.y + u.h) //colision abajo tile
        {
          _p.y = u.y + u.h;

          if(_auto_vel_stop)_p.yvelocity = 0.5;

          _ret[3] = u;
        }


      }


      //izquieda derecha
      if (_p.y < u.y + u.h && _p.y + _p.h > u.y) {
        if (_udata[0] == 1 &&
          _p.xprev + _p.w <= u.x && _p.xvelocity > 0 && _p.x + _p.w > u.x) // colision izquierda tile
        {
          _p.x = u.x - _p.w;
          if(_auto_vel_stop)_p.xvelocity = 0;
          _ret[0] = u;
        }

        if (_udata[2] == 1 &&
          _p.xprev >= u.x + u.w && _p.xvelocity < 0 && _p.x < u.x + u.w) // colosion derecha tile
        {
          _p.x = u.x + u.w;

          if(_auto_vel_stop)_p.xvelocity = 0;
          _ret[2] = u;
        }

      }

    }
    return (_ret);
  }


*/