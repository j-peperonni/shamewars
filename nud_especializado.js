function simple_hit_test(_a, _b) {

      if (_a.x + _a.w > _b.x && _a.x < _b.x + _b.w &&
        _a.y + _a.h > _b.y && _a.y < _b.y + _b.h) {
        return (1);
      }
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
