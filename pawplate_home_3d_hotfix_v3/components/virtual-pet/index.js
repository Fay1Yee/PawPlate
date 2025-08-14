
Component({
  properties:{ species:{ type:String, value:'cat' } },
  data:{ fallback:false },
  lifetimes:{
    attached(){
      const query = tt.createSelectorQuery().in(this);
      query.select('#webgl').fields({ node: true, size: true }).exec((res)=>{
        const node = res && res[0] && res[0].node;
        const size = res && res[0];
        if (!node) return this.setData({ fallback:true });
        const canvas = node;
        const dpr = (tt.getSystemInfoSync && tt.getSystemInfoSync().pixelRatio) || 2;
        const width = size.width || 300;
        const height = size.height || 200;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);

        try{
          // Try WebGL context
          const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
          if (!gl) throw new Error('no webgl');
          if (typeof THREE !== 'undefined'){
            const renderer = new THREE.WebGLRenderer({ canvas, context: gl, antialias:true, alpha:true });
            renderer.setPixelRatio(dpr);
            renderer.setSize(width, height, false);
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 100);
            camera.position.set(0,1.2,2.2);
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(2,2,2); scene.add(light);

            // Simple mesh placeholder (replace with GLTF loader)
            const geo = new THREE.IcosahedronGeometry(0.8, 1);
            const mat = new THREE.MeshStandardMaterial({ color: 0xF6C642, roughness:0.3, metalness:0.0 });
            const mesh = new THREE.Mesh(geo, mat); scene.add(mesh);

            const animate = ()=>{ mesh.rotation.y += 0.01; renderer.render(scene,camera); canvas.requestAnimationFrame(animate); };
            animate();
          }else{
            // 2D fallback drawing
            const ctx = canvas.getContext('2d');
            let t=0;
            const draw=()=>{
              const w=canvas.width, h=canvas.height;
              ctx.clearRect(0,0,w,h);
              const y = h*0.55 + Math.sin(t)*10*dpr;
              ctx.fillStyle='rgba(246,198,66,0.9)';
              const r=28*dpr;
              const cx=w/2;
              ctx.beginPath(); ctx.arc(cx, y, r, 0, Math.PI*2); ctx.fill();
              const toes=[[ -38,-28,14],[ 38,-28,14],[ -12,-44,12],[ 12,-44,12]];
              toes.forEach(([dx,dy,rr])=>{ ctx.beginPath(); ctx.arc(cx+dx*dpr, y+dy*dpr, rr*dpr, 0, Math.PI*2); ctx.fill(); });
              t+=0.05; canvas.requestAnimationFrame(draw);
            };
            draw();
          }
        }catch(err){
          // As last resort: show fallback text
          this.setData({ fallback:true });
        }
      });
    }
  }
});
