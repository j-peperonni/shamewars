function crear_boss_hitbox()
{



arguments[2]={
             ...arguments[2],
             ...{
                //draw_color:_draw_color,
                modo_hit:undefined,
                enterframe()
                {
                    this.draw_color = '';
                    if(game.debug && game.win.teclado.get('c')==1)
                    this.draw_color='rgba(0,0,255,0.3)';


                },
                on_player_hit()
                {
                  $root.level.jugador.hitcon.hit(this.modo_hit);
                }
                
                } 

             }

let _vacio = GES.crear_vacio(...arguments);

  game.enemcon.push_clip(_vacio);
return (_vacio);
}

//|crear_texto
function crear_texto(f_donde, _data={})
{

if(get_type(_data.texto)=='array' )
{
    _data.traduccion = _data.texto;
    _data.texto = _data.texto[$LEN];
}
  

let _text = textoges.crear(...arguments);
    _text.traduccion = _data.traduccion;


return(_text);
}

function lanzar_a_posicion(_x, _y, _xx, _yy, f_speed)
                        {
                        
            let _dx = _xx- _x;
            let _dy = _yy- _y;
            let _radianes = Math.atan2(_dy, _dx);

            let _rotation = _radianes*180/Math.PI+90;
            let _xvelocity = Math.sin(_rotation*(Math.PI/180))*f_speed;
            let _yvelocity = Math.cos(_rotation*(Math.PI/180))*f_speed*-1;

            return([_xvelocity, _yvelocity]);
            

                        }


function get_level_x()
    {
       return(-$root.level.x);
    }
function get_level_xw()
    {
       return(-$root.level.x+ (16*game.wt));
    }

function check(i, j)
{

      let _tilemap = GES.tileges.tilemaps[1];
      //                    x-1y-1, x+1y-1, x+1y+1 x-1y+1
      //                      /
      let _r = [0,0,0,0,   0,0,0,0];

      if(_tilemap[i][_tilemap[i].length-1-j-1]>0&&_tilemap[i][_tilemap[i].length-1-j-1]<60*5)
        _r[0]=1;

      if(_tilemap[i-1]&&
         _tilemap[i-1][_tilemap[i].length-1-j]>0&&_tilemap[i-1][_tilemap[i].length-1-j]<60*5)
        _r[1]=1;

      if(_tilemap[i-1]==undefined)
         _r[1]=-1;        
         

      if(_tilemap[i][_tilemap[i].length-1-j+1]>0&&_tilemap[i][_tilemap[i].length-1-j+1]<60*5)
        _r[2]=1;

      if(_tilemap[i+1]&&
         _tilemap[i+1][_tilemap[i].length-1-j]>0&&_tilemap[i+1][_tilemap[i].length-1-j]<60*5)
        _r[3]=1;

      if(_tilemap[i+1]==undefined)
        _r[3]=-1;




       if(_tilemap[i-1]&&
          _tilemap[i-1][_tilemap[i].length-1-j-1]>0&&_tilemap[i-1][_tilemap[i].length-1-j-1]<60*5)
       _r[4]=1;

      if(_tilemap[i-1]&&
         _tilemap[i-1][_tilemap[i].length-1-j+1]>0&&_tilemap[i-1][_tilemap[i].length-1-j+1]<60*5)
        _r[5]=1;

      if(_tilemap[i+1]&&
         _tilemap[i+1][_tilemap[i].length-1-j+1]>0&&_tilemap[i+1][_tilemap[i].length-1-j+1]<60*5)
       _r[6]=1;      

     if(_tilemap[i+1]&&
        _tilemap[i+1][_tilemap[i].length-1-j-1]>0&&_tilemap[i+1][_tilemap[i].length-1-j-1]<60*5)
       _r[7]=1;      

      return(_r);
     
}

function simple_hit_test(_a, _b) {
      
       
      if (_a.rx + _a.w > _b.rx && 
          _a.rx        < _b.rx + _b.w &&
          _a.ry + _a.h > _b.ry && 
          _a.ry        < _b.ry + _b.h) {
        return (1);
      }
  }


function crear_efecto_16(f_donde, f_data = {})
{

    let _data = {
                  ...{
                     anim_id:0,
                     x:0,
                     y:0,
                     xvelocity:0,
                     yvelocity:0,
                     grav:0.1,
                     _z:100,
                     _loadframe(){},
                     loadframe()
                     {
                     this.animdata.set_anim(this.anim_id);
                     this._loadframe();
                     
                     },
                     _enterframe(){},
                     enterframe()
                     {
                      this._enterframe();
                      
                      this.x = this.x + this.xvelocity;
                      this.y = this.y + this.yvelocity;
                     }
                     },
                  ...f_data

                }

   let _clip = GES.cargar_clase(f_donde, 3, _data);

   return(_clip);

}

function crear_particula(f_donde=$root.level, f_data={})
{

    let _data = {
                  ...{
                     anim_id:0,
                     x:0,
                     y:0,
                     xvelocity:0,
                     yvelocity:0,
                     grav:0.1,
                     _z:100,
                     loadframe()
                     {
                     this.animdata.set_anim(this.anim_id);
                     //this.xvelocity=-3+Math.random()*6;
                     //this.yvelocity=-1-Math.random()*5;
                     this.animdata.force.flip=[$root.level.jugador.orien,0];
                     },
                     enterframe()
                     {
                      this.yvelocity+=this.grav;
                      this.xvelocity+= (0-this.xvelocity)/30;
                      this.x = this.x + this.xvelocity;
                      this.y = this.y + this.yvelocity;

                      this.rotation+=0.01;

                     }
                     },
                  ...f_data

                }

   let _clip = GES.cargar_clase(f_donde, 3, _data);

   return(_clip);

}


  //|textoges
    textoges=
    {
     fuentes:
     {
      //"_data/images/fuente_tb4x4.png",
      nb8x8:
		    {
		    img_id:8,
		    w:[8,8],
		    h:[8,8],
		    },
      opciones:
      {
      img_id:10,
      w:[10,10],
      h:[18,18],
      },
      opciones_simple:
      {
      img_id:11,
      w:[10,10],
      h:[18,18],
      }


     },

    crear(f_donde=$root, f_data = {}, f_fuente='nb8x8')
    {
      let _fuente = this.fuentes[f_fuente];
      let _data ={
                  ...{
                     texto:'test',
                     x:0,
                     y:0,
                     //max_char:5,
                     gameges:game.win.gameges,
                     image:$LIB.IMAGES[_fuente.img_id],
                     canvas:DUMMY_CANVAS,
                     canvas_id:1,
                  
                     ..._fuente
                     },
                     ...f_data
                 }

     return(RPG.crear_texto(f_donde, _data));

    },
    
    }
