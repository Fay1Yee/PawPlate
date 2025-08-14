
Component({
  data:{ fallback: false },
  lifetimes:{
    attached(){
      const query = tt.createSelectorQuery().in(this);
      query.select('#webgl').node(res=>{
        const canvas = res.node;
        if (!canvas) { this.setData({ fallback:true }); return; }
        // If THREE is available, init a simple scene; otherwise draw a 2D bobbing paw placeholder.
        try{
          if (typeof THREE !== 'undefined') {
            const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
            renderer.setSize(canvas.width, canvas.height);
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(45, canvas.width/canvas.height, 0.1, 100);
            camera.position.z = 3;
            const light = new THREE.DirectionalLight(0xffffff, 1); light.position.set(2,2,2); scene.add(light);
            const geo = new THREE.IcosahedronGeometry(1, 1);
            const mat = new THREE.MeshStandardMaterial({ color: 0xF6C642, roughness:0.3, metalness:0.0 });
            const mesh = new THREE.Mesh(geo, mat); scene.add(mesh);
            const animate =()=>{ mesh.rotation.y += 0.01; renderer.render(scene,camera); canvas.requestAnimationFrame(animate); };
            animate();
          } else {
            const ctx = canvas.getContext('2d');
            let t=0;
            const draw=()=>{
              const w=canvas.width, h=canvas.height;
              ctx.clearRect(0,0,w,h);
              const y = h*0.5 + Math.sin(t)*10;
              // simple paw (circle + 4 toes)
              ctx.fillStyle='rgba(246,198,66,0.9)';
              const r=28;
              const cx=w/2;
              ctx.beginPath(); ctx.arc(cx, y, r, 0, Math.PI*2); ctx.fill();
              const toes=[[ -38,-28,14],[ 38,-28,14],[ -12,-44,12],[ 12,-44,12]];
              toes.forEach(([dx,dy,rr])=>{ ctx.beginPath(); ctx.arc(cx+dx, y+dy, rr, 0, Math.PI*2); ctx.fill(); });
              t+=0.05;
              canvas.requestAnimationFrame(draw);
            };
            draw();
          }
        }catch(err){ this.setData({ fallback:true }); }
      }).exec();
    }
  }
});
