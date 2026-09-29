/* Shanghai Pocket Atlas. All scene assets and trip data remain local. */
(() => {
  'use strict';
  const data = window.TRIP_DATA;
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const places = new Map(data.places.map(place => [place.id, place]));
  const colors = {3:'#c98244',4:'#419681',5:'#6e8faf'};
  const metroColors = {7:'#d27a39',8:'#4898b5',10:'#a991bd',11:'#945450',12:'#278c75',14:'#9b9f5c'};
  const dayInfo = Object.fromEntries(data.days.map(day => [day.id, {
    start:day.start, end:day.end, lines:day.lines, short:day.title, subtitle:day.summary
  }]));
  const paths = {
    'arrow-up-right':'<path d="M6 18 18 6M6 6h12v12"/>',
    'chevron-right':'<path d="m9 5 7 7-7 7"/>',
    'chevron-left':'<path d="m15 5-7 7 7 7"/>',
    'chevron-down':'<path d="m6 9 6 6 6-6"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',
    close:'<path d="m6 6 12 12M18 6 6 18"/>',
    moon:'<path d="M20.3 14A8.5 8.5 0 0 1 10 3.7 8.5 8.5 0 1 0 20.3 14Z"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    hourglass:'<path d="M6 3h12M6 21h12M7 3v3c0 3 4 4 4 6s-4 3-4 6v3m10-18v3c0 3-4 4-4 6s4 3 4 6v3M9 18h6"/>',
    pin:'<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.3"/>',
    metro:'<rect x="5" y="3" width="14" height="15" rx="3"/><path d="M5 10h14M9 18l-3 3m9-3 3 3M9 6h6"/><path d="M8 14h.01M16 14h.01" stroke-width="3"/>',
    route:'<circle cx="5" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><path d="M7 5h8a4 4 0 0 1 0 8H9a3 3 0 0 0 0 6h8"/>',
    checklist:'<rect x="5" y="4" width="15" height="17" rx="2"/><path d="M9 3h7v3H9zM9 11l1 1 2-2m3 1h2M9 16l1 1 2-2m3 1h2"/>',
    plane:'<path d="m21 3-5 18-4-8-8-4 17-6ZM12 13l9-10M4 16l-2 6 6-2"/>',
    layers:'<path d="m12 3 10 6-10 6L2 9l10-6Zm-10 12 10 6 10-6M2 12l10 6 10-6"/>',
    scan:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/><circle cx="12" cy="12" r="3"/>',
    rotate:'<path d="M4 9a8 8 0 1 1 0 7M4 3v6h6"/>',
    expand:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M3 3l6 6m12-6-6 6M3 21l6-6m12 6-6-6"/>',
    play:'<path d="m8 4 12 8-12 8Z" fill="currentColor" stroke="none"/>',
    pause:'<path d="M8 5v14M16 5v14" stroke-width="3"/>',
    camera:'<path d="M4 7h3l2-3h6l2 3h3v14H4Z"/><circle cx="12" cy="13" r="4"/>',
    drag:'<path d="M8 13V5a2 2 0 0 1 4 0v6-3a2 2 0 0 1 4 0v4-1a2 2 0 0 1 4 0v5l-3 5H9l-6-7a2 2 0 0 1 3-2l2 2"/>',
    ticket:'<path d="M3 6h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4V6Zm12 0v2m0 3v2m0 3v2"/>',
    bag:'<path d="M5 7h14v14H5zM9 7V3h6v4M8 11v6m8-6v6"/>',
    leaf:'<path d="M5 19c-7-14 13-10 15-17 4 15-7 22-15 17Zm0 0 10-9M3 22l2-3"/>'
  };
  const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.pin}</svg>`;
  const escape = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const state = {day:'all',selected:'hotel',theme:'day',top:false,labels:true,checked:{}};
  try {
    const stored = JSON.parse(localStorage.getItem('shanghai-atlas-v1') || '{}');
    if (['all','3','4','5'].includes(stored.day)) state.day=stored.day;
    if (places.has(stored.selected)) state.selected=stored.selected;
    if (stored.theme==='night') state.theme='night';
    if (stored.checked && typeof stored.checked==='object') state.checked=stored.checked;
  } catch {}
  let scene=null, toastTimer, sceneAvailable=false;
  const tour={index:-1,playing:false,timer:null};
  const mobile=()=>matchMedia('(max-width:900px)').matches;
  function persist(){try{localStorage.setItem('shanghai-atlas-v1',JSON.stringify(state))}catch{}}
  function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3000)}
  function lineBadges(text){
    const lines=[...new Set((text.match(/\d+号线/g)||[]))];
    return lines.length?`<span class="transit-badges">${lines.map(line=>`<span class="line-badge" style="--metro-color:${metroColors[parseInt(line)]||'#758676'}">${line}</span>`).join('')}</span>`:'';
  }
  function artwork(place){
    const art={
      hotel:'<path d="M18 68V22h40v46M14 68h50M27 30h5v5h-5zM43 30h5v5h-5zM27 43h5v5h-5zM43 43h5v5h-5zM32 68V56h12v12M23 18h30M36 12h5"/>',
      tower:'<path d="M10 70V41l9-7 8 7v29M13 46h11m-11 7h11m-11 7h11M32 70V22l8-11 8 11v48M34 25h12l-2 7h-8zM55 70c-8-22 8-30 0-56l9-9c-1 20 9 27 3 65M56 20l11 7M55 34l14 6M53 49l16 6M5 71h67"/>',
      museum:'<path d="M10 24h60l-5 9H15zM14 36h52l-5 7H19zM20 46h40v8H20zM26 54v15m28-15v15M19 70h43M30 17h20M25 13h30"/>',
      gallery:'<path d="M9 68V32l23-11 39 9v38H9Zm0-36 39 11 23-13M48 43v25M15 40l7 2v18l-7-2zM27 44l7 2v18l-7-2zM39 47l4 1v18l-4-1zM56 44v17m8-20v20M5 71h70"/>',
      historic:'<path d="M12 69V31l27-15 27 15v38M7 31l32-20 32 20M18 39h11v15H18zM49 39h11v15H49zM32 69V43h14v26M36 49h6M9 71h62M21 24v-9h8v4"/>',
      campus:'<path d="M9 70V27h14v43M55 70V27h14v43M6 27h20v-6H6zM52 27h20v-6H52zM23 70V45a16 16 0 0 1 32 0v25M28 70V45a11 11 0 0 1 22 0v25M25 32h29M7 71h66M15 35h3v18m43-18h3v18"/>',
      robot:'<path d="m32 12 8-5 8 5-2 12H34Zm-7 17 15-5 15 5-3 22-12 7-12-7ZM35 15h10M30 33l10 6 10-6M34 42h12l-6 8-6-8M25 29l-8 4-5 20 7 3 9-13M55 29l8 4 5 20-7 3-9-13M31 53l-5 18h10l4-15 4 15h10l-5-18M24 72h14m4 0h14"/>',
      airport:'<path d="m40 10 4 3 2 20 25 17v7L45 46v14l10 9v5l-15-5-15 5v-5l10-9V46L9 57v-7l25-17 2-20 4-3Z"/>',
      waterfront:'<path d="M8 48h62M15 48V26h11v22M31 48V18l7-7 7 7v30M52 48V29h10v19M8 58q8-6 16 0t16 0 16 0 16 0M8 68q8-6 16 0t16 0 16 0 16 0M57 15v7m-4-3h8"/>'
    };
    return `<svg viewBox="0 0 80 80" aria-hidden="true">${art[place.kind]||art.historic}</svg>`;
  }
  function setMobileView(view){
    if(view==='bookings'){dialog('#booking-dialog');return;}
    document.body.dataset.mobileView=view;
    $$('[data-view]').forEach(button=>{const active=button.dataset.view===view;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active))});
    if(view==='plan') pauseTour();
    window.scrollTo({top:0,behavior:'instant'});
  }
  function mapLink(place){const query={hotel:'全季酒店上海陆家嘴浦东大道店',tower:'上海之巅观光厅',northbund:'北外滩国客中心',wukang:'武康大楼',sam:'上海漕宝路叠彩路萨姆',airport:'上海虹桥机场T2'}[place.id]||place.name;return 'https://uri.amap.com/search?keyword='+encodeURIComponent(query)+'&city=上海&view=map'}
  function select(id,{focus=true,open=false,fromTour=false}={}){
    if(!places.has(id))return;
    if(!fromTour)stopTour();
    state.selected=id;
    const place=places.get(id);
    $('#place-name').textContent=place.name;
    $('#place-subtitle').textContent=place.subtitle;
    $('#place-kicker').textContent=place.day?`OCTOBER 0${place.day} · ${place.day===5?'HOMEWARD':'CITY DISCOVERY'}`:'YOUR BASE IN SHANGHAI';
    $('#place-time').textContent=place.time;$('#place-wait').textContent=place.wait;
    $('#place-tags').innerHTML=place.tags.map(tag=>`<span>${escape(tag)}</span>`).join('');
    $('#place-art').innerHTML=artwork(place);$('#transport-preview').textContent=place.transport;
    $('#navigate-link').href=mapLink(place);
    $$('.stop').forEach(button=>{const active=button.dataset.place===id;button.classList.toggle('selected',active);button.setAttribute('aria-pressed',String(active))});
    if(focus)scene?.select(id);
    if(open)detail();
    persist();
  }
  function stopButton(place,time,index){return `<button class="stop${state.selected===place.id?' selected':''}" data-place="${place.id}" aria-pressed="${state.selected===place.id}"><span class="stop-number">${String(index).padStart(2,'0')}</span><span class="stop-info"><strong>${escape(place.short)}</strong><small>${escape(time)}</small></span><span class="stop-arrow">${icon('arrow-up-right')}</span></button>`}
  function renderTimeline(){
    let html='';
    if(state.day==='all'){
      html=`<div class="arrival-note">${icon('bag')}<div><strong>10.02 · 晚间抵沪</strong>入住全季浦东大道店，给明天留一点好精神。</div></div>`;
      data.days.forEach(day=>{
        const info=dayInfo[day.id];
        html+=`<section class="timeline-day" style="--day-color:${colors[day.id]}"><button class="timeline-day-heading" data-open-day="${day.id}"><span class="date-square">0${day.id}</span><span>${escape(info.short)}<small>${info.start} 出发 · ${day.id==='5'?'08:40 起飞':info.end+' 回到酒店'}</small></span>${icon('chevron-right')}</button>`;
        day.route.filter((id,index)=>id!=='hotel'&&day.route.indexOf(id)===index).forEach((id,index)=>{
          const place=places.get(id),entry=day.schedule.find(item=>item.placeId===id&&['visit','flight'].includes(item.type));
          html+=stopButton(place,entry?.time||place.duration,index+1);
        });html+='</section>';
      });
      $('#route-title').textContent='三日行程，一眼看懂';$('#route-count').textContent=`${data.places.length}处地点`;$('#route-kicker').textContent='THE JOURNEY';
      $('#map-title').textContent='沿着黄浦江，收藏上海。';$('#map-subtitle').textContent='从云端天际线到梧桐街巷，把想看的上海串成一条路。';$('#day-insight').innerHTML='';
    }else{
      const day=data.days.find(day=>day.id===state.day),info=dayInfo[state.day];let count=0;
      day.schedule.forEach(item=>{
        if(['visit','flight'].includes(item.type)&&item.placeId){html+=stopButton({...places.get(item.placeId),short:item.title},item.time,++count)}
        else html+=`<details class="transit-expand"><summary><time>${escape(item.time)} · ${{transit:'交通',wait:'等待预留',meal:'补充能量',stay:'准备',walk:'街区散步'}[item.type]||'安排'}</time><span class="transit-title">${escape(item.title)}${lineBadges(item.detail)}</span>${icon('chevron-down')}</summary><p>${escape(item.detail)}</p></details>`;
      });
      html+=`<p class="small-note">${escape(day.note)}</p>`;
      $('#route-title').textContent=day.title;$('#route-count').textContent=state.day==='5'?'08:40起飞':`${count}段停留`;$('#route-kicker').textContent=`OCTOBER 0${state.day} / 2026`;
      $('#map-title').textContent=day.subtitle;$('#map-subtitle').textContent=info.subtitle;
      $('#day-insight').innerHTML=`<span>出发<b>${info.start}</b></span><span>${state.day==='5'?'起飞':'回店'}<b>${info.end}</b></span><span>地铁<b>${info.lines}</b></span>`;
    }
    $('#timeline').innerHTML=html;
    $$('.stop').forEach(button=>button.addEventListener('click',()=>select(button.dataset.place,{open:mobile()})));
    $$('[data-open-day]').forEach(button=>button.addEventListener('click',()=>setDay(button.dataset.openDay)));
    $$('[data-day]').forEach(button=>{const active=button.dataset.day===state.day;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active))});
    $$('[data-route]').forEach(button=>{const active=button.dataset.route===state.day;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));button.style.opacity=state.day==='all'||active?'1':'.45'});
  }
  function setDay(day){
    if(!['all','3','4','5'].includes(day))return;
    stopTour();state.day=day;renderTimeline();scene?.setDay(day);
    const id=day==='all'?'hotel':data.days.find(item=>item.id===day).route.find(id=>id!=='hotel');
    select(id,{focus:false});scene?.select(id);scene?.reset();
    state.top=false;$('#top-view').setAttribute('aria-pressed','false');
    $('.sidebar-scroll').scrollTop=0;persist();
  }
  function setTheme(theme){state.theme=theme;document.body.classList.toggle('night',theme==='night');$('#theme-btn').setAttribute('aria-pressed',String(theme==='night'));$('#theme-icon').innerHTML=icon(theme==='night'?'sun':'moon');$('#theme-text').textContent=theme==='night'?'日景':'夜景';document.querySelector('meta[name="theme-color"]').content=theme==='night'?'#142721':'#f5f3ed';scene?.setTheme(theme);persist()}
  function dialog(selector){pauseTour();const element=$(selector);if(!element.open)element.showModal();element.scrollTop=0}
  function detail(){
    const place=places.get(state.selected);
    const sections=[['clock','计划时段',place.time],['metro','怎么过去',place.transport],['hourglass','候车与排队',place.wait],['ticket','预约与门票',place.ticket]];
    $('#dialog-place-body').innerHTML=`<div class="detail-hero"><div class="place-art">${artwork(place)}</div><div><h2>${escape(place.name)}</h2><p>${escape(place.subtitle)}</p></div></div><p class="dialog-intro">${escape(place.description)}</p>${sections.map(([symbol,title,content])=>`<section class="info-block"><h3>${icon(symbol)}${title}</h3>${symbol==='metro'?lineBadges(content):''}<p>${escape(content)}</p></section>`).join('')}<a class="button primary" href="${mapLink(place)}" target="_blank" rel="noopener noreferrer">在地图中查看 ${icon('arrow-up-right')}</a>${place.sourceUrl?`<a class="source-row" href="${escape(place.sourceUrl)}" target="_blank" rel="noopener noreferrer">查看此地点的信息来源 ↗</a>`:''}`;
    dialog('#detail-dialog');
  }
  const bookings=[...data.bookings.filter(item=>item.priority==='required'),{id:'flight-check',title:'首班地铁与航班手续',when:'10月4日晚复核',detail:data.meta.flightNote,url:'https://www.shmetro.com/'}];
  function renderBookings(){
    $('#booking-list').innerHTML=bookings.map(item=>`<div class="booking-row${state.checked[item.id]?' done':''}"><input type="checkbox" id="book-${item.id}" data-book="${item.id}" ${state.checked[item.id]?'checked':''}><div><label for="book-${item.id}">${escape(item.title)}</label><small>${escape(item.when)}<br>${escape(item.detail)}</small><a href="${escape(item.url)}" target="_blank" rel="noopener noreferrer">${item.id==='sjtu-register'?'校方参观规则':'查看官方信息'} ${icon('arrow-up-right')}</a></div></div>`).join('')+`<section class="info-block"><h3>${icon('leaf')}这些普通参观无需提前买票</h3><p>中华艺术宫常设展、一大纪念馆与会址、三件套街头机位、北外滩公共滨江步道、武康路与武康大楼外观、萨姆户外装置。</p></section>`;
    $$('[data-book]').forEach(input=>input.addEventListener('change',()=>{state.checked[input.dataset.book]=input.checked;input.closest('.booking-row').classList.toggle('done',input.checked);persist();updateCount()}));updateCount();
  }
  function updateCount(){const complete=bookings.filter(item=>state.checked[item.id]).length,total=bookings.length;$('.count').textContent=`${complete}/${total}`;$('.mobile-count').textContent=`${complete}/${total}`;$('#booking-btn').setAttribute('aria-label',`出发清单，${total}项中已完成${complete}项`);$('#booking-progress-text').textContent=`已完成 ${complete} / ${total} 项`;$('#booking-progress-fill').style.width=`${complete/total*100}%`}
  function pauseTour(){clearInterval(tour.timer);tour.timer=null;tour.playing=false;$('#tour-play').innerHTML=icon('play');$('#tour-play').setAttribute('aria-pressed','false');$('#tour-play').setAttribute('aria-label','开始逐站漫游')}
  function stopTour(){pauseTour();if(tour.index!==-1)scene?.setRouteProgress?.(state.day,-1);tour.index=-1;$('#tour-title').textContent='让行程在眼前展开';$('#tour-subtitle').textContent='逐站漫游 · 约半分钟看完一天';$('#tour-progress-fill').style.width='0%'}
  function tourStep(index){
    if(!sceneAvailable)return;
    if(state.day==='all')setDay('3');
    const day=data.days.find(day=>day.id===state.day);tour.index=Math.max(0,Math.min(index,day.route.length-1));
    const id=day.route[tour.index],place=places.get(id);
    select(id,{focus:false,fromTour:true});
    if(scene.setRouteProgress)scene.setRouteProgress(state.day,tour.index);else scene.select(id);
    $('#tour-title').textContent=place.short;
    $('#tour-subtitle').textContent=`10.0${state.day} · 第 ${tour.index+1} / ${day.route.length} 站${id==='hotel'?(tour.index===0?' · 从这里出发':' · 回到酒店'):''}`;
    $('#tour-progress-fill').style.width=`${(tour.index+1)/day.route.length*100}%`;
  }
  function toggleTour(){
    if(tour.playing){pauseTour();return;}
    if(!sceneAvailable)return;
    if(state.day==='all')setDay('3');
    const day=data.days.find(day=>day.id===state.day);
    if(tour.index<0||tour.index>=day.route.length-1)tourStep(0);
    tour.playing=true;$('#tour-play').innerHTML=icon('pause');$('#tour-play').setAttribute('aria-pressed','true');$('#tour-play').setAttribute('aria-label','暂停逐站漫游');
    tour.timer=setInterval(()=>{if(tour.index>=day.route.length-1){pauseTour();toast('这一天看完了，按你的节奏出发。')}else tourStep(tour.index+1)},5000);
  }
  function capture(){
    if(!sceneAvailable)return;
    try{
      const original=scene.getCanvas(),out=document.createElement('canvas'),bounds=original.getBoundingClientRect(),scale=original.width/bounds.width;
      out.width=original.width;out.height=original.height+112;const context=out.getContext('2d');
      context.fillStyle=state.theme==='night'?'#142721':'#f5f3ed';context.fillRect(0,0,out.width,out.height);context.drawImage(original,0,0);
      if(state.labels)$$('.map-label').forEach(label=>{
        const style=getComputedStyle(label),box=label.getBoundingClientRect();if(style.display==='none'||!box.width)return;
        const x=(box.left-bounds.left)*scale,y=(box.top-bounds.top)*scale,w=box.width*scale,h=box.height*scale;
        context.save();context.globalAlpha=Number(style.opacity);context.fillStyle=style.backgroundColor;context.beginPath();context.roundRect(x,y,w,h,6*scale);context.fill();
        context.fillStyle=getComputedStyle(label.querySelector('.label-dot')).backgroundColor;context.beginPath();context.arc(x+11*scale,y+h/2,2.5*scale,0,Math.PI*2);context.fill();
        context.fillStyle=style.color;context.font=`${11*scale}px "Microsoft YaHei",sans-serif`;context.textBaseline='middle';context.fillText(label.querySelector('.label-name').textContent,x+20*scale,y+h/2,w-26*scale);context.restore();
      });
      context.fillStyle=state.theme==='night'?'#e8ebe0':'#243e36';context.font='24px "Microsoft YaHei",sans-serif';context.fillText('沪上漫游 · SHANGHAI POCKET ATLAS',28,original.height+43,out.width-56);
      context.font='14px "Microsoft YaHei",sans-serif';context.fillText(`2026.10.02—10.05 · ${state.day==='all'?'我的上海旅行地图':dayInfo[state.day].short}`,28,original.height+69,out.width-56);
      context.font='11px "Microsoft YaHei",sans-serif';context.fillText('建筑与路线为非等比例艺术示意，不用于实际导航',28,original.height+92,out.width-56);
      const link=document.createElement('a');link.download='shanghai-pocket-atlas.png';link.href=out.toDataURL('image/png');link.click();toast('这张上海明信片，保存好了。');
    }catch{toast('图片暂时无法保存，请使用浏览器截图')}
  }
  function fail(error){
    sceneAvailable=false;console.warn('3D scene unavailable:',error?.message);$('#loading').classList.remove('done');$('#loading').innerHTML='<strong>先看看你的旅行手册</strong><span>当前设备无法显示3D，行程和出发清单仍可使用。</span>';$('#loading').style.pointerEvents='none';
    $$('.map-controls button, #capture-btn, #tour-play, #tour-prev, #tour-next, #fullscreen-btn').forEach(button=>button.disabled=true);
  }
  function bind(){
    $$('[data-icon]').forEach(element=>element.innerHTML=icon(element.dataset.icon));
    $$('[data-day]').forEach(button=>button.addEventListener('click',()=>setDay(button.dataset.day)));
    $$('[data-route]').forEach(button=>button.addEventListener('click',()=>setDay(state.day===button.dataset.route?'all':button.dataset.route)));
    $$('[data-view]').forEach(button=>button.addEventListener('click',()=>setMobileView(button.dataset.view)));
    $('#hotel-btn').onclick=()=>select('hotel',{open:mobile()});$('#flight-btn').onclick=()=>{setDay('5');if(mobile())detail()};
    $('.brand').onclick=event=>{event.preventDefault();setDay('all');setMobileView('map')};
    $('.skip-link').onclick=()=>setMobileView('plan');
    $('#theme-btn').onclick=()=>setTheme(state.theme==='day'?'night':'day');$('#detail-more').onclick=detail;$('#transport-more').onclick=detail;
    $('#booking-btn').onclick=()=>dialog('#booking-dialog');$('#sources-btn').onclick=()=>dialog('#sources-dialog');
    $('#zoom-in').onclick=()=>scene?.zoom(1.18);$('#zoom-out').onclick=()=>scene?.zoom(1/1.18);$('#rotate-left').onclick=()=>scene?.rotate(Math.PI/8);
    $('#top-view').onclick=()=>{pauseTour();state.top=!state.top;$('#top-view').setAttribute('aria-pressed',String(state.top));scene?.setTopView(state.top)};
    $('#reset-view').onclick=()=>{pauseTour();state.top=false;$('#top-view').setAttribute('aria-pressed','false');scene?.reset()};
    $('#labels-btn').onclick=()=>{state.labels=!state.labels;$('#scene').classList.toggle('labels-hidden',!state.labels);$('#labels-btn').setAttribute('aria-pressed',String(state.labels))};
    $('#fullscreen-btn').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('.map-stage').requestFullscreen()}catch{toast('当前浏览器不支持全屏，可使用缩放按钮探索')}};
    document.addEventListener('fullscreenchange',()=>$('#fullscreen-btn').setAttribute('aria-label',document.fullscreenElement?'退出全屏沙盘':'全屏查看沙盘'));
    $('#tour-play').onclick=toggleTour;$('#tour-prev').onclick=()=>{pauseTour();tourStep(Math.max(0,tour.index-1))};$('#tour-next').onclick=()=>{pauseTour();tourStep(tour.index+1)};
    $('#capture-btn').onclick=capture;
    $$('.dialog-close').forEach(button=>button.onclick=()=>button.closest('dialog').close());
    $$('dialog').forEach(element=>element.addEventListener('click',event=>{if(event.target===element){const bounds=element.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)element.close()}}));
    $('#scene').addEventListener('pointerdown',()=>pauseTour());
    document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseTour()});
  }
  $('#source-list').innerHTML=data.sources.map(source=>`<a class="source-row" href="${escape(source.url)}" target="_blank" rel="noopener noreferrer">${escape(source.title)} ↗<small>${escape(source.note)}</small></a>`).join('');
  bind();renderTimeline();renderBookings();select(state.selected,{focus:false});setTheme(state.theme);
  try{
    if(!window.THREE||!window.createShanghaiScene)throw new Error('3D resources unavailable');
    scene=window.createShanghaiScene({container:$('#scene'),places:data.places,days:data.days,onSelect:id=>select(id,{focus:false,open:mobile()}),onReady:()=>{sceneAvailable=true;$('#loading').classList.add('done')},onError:fail});
    scene.setDay(state.day);scene.setTheme(state.theme);scene.select(state.selected);scene.reset();
  }catch(error){fail(error)}
  window.addEventListener('pagehide',event=>{pauseTour();if(!event.persisted)scene?.dispose()});
})();
