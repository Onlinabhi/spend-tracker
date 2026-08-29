/* Spend Tracker V21 shell + adapters. The legacy business logic remains isolated in app.js. */
(function(){
  const $=id=>document.getElementById(id);
  const root=document.documentElement;
  const esc2=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  // --- Theme engine -------------------------------------------------------
  const THEMES=window.SPT_THEMES||{};
  function ensureThemeState(){
    state.themePreset = state.themePreset && THEMES[state.themePreset] ? state.themePreset : 'ocean-mint';
  }
  function applyPresetTheme(){
    ensureThemeState();
    const t=THEMES[state.themePreset]||THEMES['ocean-mint'];
    const p=state.dark ? t.dark : t.light;
    const vars={
      '--bg':p.bg,'--surface':p.surface,'--surface2':p.surface2,'--text':p.text,'--muted':p.muted,'--line':p.line,
      '--accent':p.accent,'--money':p.money,'--money2':p.money2,'--wealth':p.wealth,'--wealth2':p.wealth2,
      '--money-bg':p.surface2,'--wealth-bg':p.surface2,'--page-accent':p.accent
    };
    Object.entries(vars).forEach(([k,v])=>root.style.setProperty(k,v));
    document.body.dataset.theme=state.themePreset;
    document.body.classList.add('v21-theme');
  }
  window.setThemePreset=function(key){
    if(!THEMES[key])return;
    state.themePreset=key; state.themeMode='manual'; save(); applyPresetTheme(); renderTheme?.(); refresh();
  };

  // --- Profile as global control ----------------------------------------
  const baseRenderProfile=window.renderProfile;
  window.renderProfile=function(){
    baseRenderProfile?.();
    const name=typeof getProfileName==='function'?getProfileName():'Abhishek';
    const photo=localStorage.getItem(typeof PHOTO_KEY!=='undefined'?PHOTO_KEY:'spend_tracker_profile_photo_v1');
    const h=$('headerProfileAvatar');
    if(h){h.textContent=''; if(photo){h.style.backgroundImage=`url(${photo})`;h.style.backgroundSize='cover';h.style.backgroundPosition='center'} else {h.style.backgroundImage='';h.textContent=typeof profileInitials==='function'?profileInitials(name):String(name||'A').slice(0,1).toUpperCase();}}
  };

  // --- Settings hub ------------------------------------------------------
  const legacyOpen=window.openSettingsPanel;
  window.openSettingsPanel=function(){
    if(typeof setupOverhaul==='function')setupOverhaul();
    const p=$('settingsPanel');
    if(p){p.classList.add('show');p.setAttribute('aria-hidden','false');return;}
    legacyOpen?.();
  };
  window.closeSettingsPanel=function(){const p=$('settingsPanel');if(p){p.classList.remove('show');p.setAttribute('aria-hidden','true');}};

  // More is gone. Any old call becomes Settings.
  window.openMore=function(){window.openSettingsPanel()};
  const baseOpenWealth=window.openWealthPage;
  window.openWealthPage=function(p){ if(p==='more'){window.openSettingsPanel();return;} baseOpenWealth?.(p); };

  // --- Navigation --------------------------------------------------------
  const baseNavigate=window.navigate;
  window.navigate=function(section){
    if(section==='more'){window.openSettingsPanel();return;}
    baseNavigate?.(section);
    syncBottomNav();
    window.scrollTo({top:0,behavior:'smooth'});
  };
  function syncBottomNav(){
    const active=(app.mode==='money'?app.moneyPage:app.wealthPage)||'home';
    document.querySelectorAll('nav .navitem').forEach(b=>b.classList.remove('v21-active'));
    const map={home:'navHome',transactions:'navTx',analytics:'navAnalytics',budgets:'navBudget'};
    $(map[active]||'navHome')?.classList.add('v21-active');
  }

  // --- Transaction preview ----------------------------------------------
  window.openTxMenu=function(id){
    const x=state.money.tx.find(t=>t.id===id); if(!x)return;
    app.editingTx=id;
    const title=x.desc||(x.type==='transfer'?'To '+x.person:x.cat)||'Transaction';
    const date=x.date?new Date(x.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}):'Date unavailable';
    $('txActionTitle').textContent=title;
    $('txActionMeta').textContent=date;
    const details=$('txPreviewDetails');
    if(details){
      const type=x.type==='income'?'Income':x.type==='expense'?'Expense':'Personal transfer';
      const rows=[['Type',type],['Amount',(x.type==='income'?'+':x.type==='transfer'?'→':'−')+' '+money(x.amount)],['Date',date],['Category',x.cat||'—'],['Payment',x.method||'—'],['Account',x.account||'—'],['Person',x.person||'—'],['Reason',x.occasion||'—'],['Description',x.desc||'—']];
      details.innerHTML=rows.filter(r=>r[1]&&r[1]!=='—').map(r=>`<div class="v21-detail-row"><span>${esc2(r[0])}</span><b>${esc2(r[1])}</b></div>`).join('');
    }
    $('txActionModal')?.classList.add('show');
  };

  // --- Modern transaction cards -----------------------------------------
  window.txHtml=function(arr){
    if(!arr.length)return '<div class="empty">No transactions found.</div>';
    return arr.map(x=>{
      const inc=x.type==='income',tr=x.type==='transfer';
      const title=x.desc||(tr?'To '+x.person:x.cat)||'Transaction';
      const meta=tr?[x.occasion,x.method]:[x.cat,inc?'Credited to '+(x.account||''):x.method];
      const bg=inc?'var(--success-surface)':tr?'var(--info-surface)':x.amount>2000?'var(--danger-surface)':'var(--surface2)';
      const date=x.date?new Date(x.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}):'Date unavailable';
      return `<div class="tx v21-tx" data-id="${esc2(x.id)}" onclick="openTxMenu('${esc2(x.id)}')" style="border-left-color:${inc?'var(--success)':tr?'var(--info)':x.amount>2000?'var(--danger)':'var(--accent)'}"><div class="tx-icon" style="background:${bg}">${inc?'💰':tr?'🤝':iconFor(x.cat)}</div><div class="tx-info"><div class="tx-title">${esc2(title)}</div><div class="tx-meta">${esc2(meta.filter(Boolean).join(' · '))}</div><div class="tx-date">${esc2(date)}</div></div><div class="tx-amount ${inc?'positive':tr?'tx-transfer':''}">${inc?'+':tr?'→':'−'} ${money(x.amount)}</div><button class="tx-menu" aria-label="Open transaction" onclick="event.stopPropagation();openTxMenu('${esc2(x.id)}')">›</button></div>`;
    }).join('');
  };

  // --- Home quick search: 7 days by default -----------------------------
  window.renderHomeFeed=function(){
    const q=($('mHomeSearch')?.value||'').trim().toLowerCase();
    const days=Number($('mHomeScope')?.value||7);
    const now=new Date();
    const filtered=state.money.tx.filter(x=>{
      const d=new Date(x.date); const age=(now-d)/864e5;
      const hay=[x.desc,x.cat,x.method,x.person,x.occasion,x.account,x.type].filter(Boolean).join(' ').toLowerCase();
      return age>=-0.1&&age<days+0.01&&hay.includes(q);
    }).sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,12);
    $('mRecent').innerHTML=window.txHtml(filtered);
  };

  // --- Theme controls in settings --------------------------------------
  function installThemeControls(){
    document.querySelectorAll('.settings-list-card details').forEach(d=>{
      if(d.querySelector('.v21-theme-grid'))return;
      const summary=d.querySelector('summary');
      if(!summary||!summary.textContent.includes('Appearance'))return;
      const body=d.querySelector('.settings-body'); if(!body)return;
      const wrap=document.createElement('div'); wrap.className='v21-theme-box';
      wrap.innerHTML=`<div class="v21-setting-label">Color theme</div><div class="v21-theme-grid">${Object.entries(THEMES).map(([k,v])=>`<button type="button" class="v21-theme-chip" data-theme="${k}" onclick="setThemePreset('${k}')"><span>${v.emoji}</span>${v.label}</button>`).join('')}</div>`;
      body.appendChild(wrap);
    });
  }

  // --- Global overlay/accordion behavior --------------------------------
  function installInteractionRules(){
    document.addEventListener('click',e=>{
      const p=$('settingsPanel');
      if(p?.classList.contains('show')&&e.target===p)window.closeSettingsPanel();
      const modal=e.target?.closest?.('.modal.show');
      if(modal&&e.target===modal&&!modal.id.includes('settings'))modal.classList.remove('show');
    },{capture:true});
    document.addEventListener('toggle',e=>{
      const d=e.target;if(!(d instanceof HTMLDetailsElement)||!d.open)return;
      const parent=d.parentElement; parent?.querySelectorAll?.(':scope > details').forEach(s=>{if(s!==d)s.open=false});
    },true);
    const closeTransient=()=>document.querySelectorAll('.modal.show').forEach(m=>{if(m.id!=='settingsPanel')m.classList.remove('show')});
    let last=0;
    window.addEventListener('scroll',()=>{const now=Date.now();if(now-last>40){last=now;closeTransient()};},{passive:true});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeTransient();window.closeSettingsPanel?.();}});
  }

  // --- Profile button + version state -----------------------------------
  function boot(){
    ensureThemeState(); applyPresetTheme();
    installThemeControls(); installInteractionRules(); syncBottomNav();
    renderProfile?.();
    // Make header and screen personalization genuinely global.
    const oldHeader=window.header;
    window.header=function(force=false){oldHeader?.(force);renderProfile?.();syncBottomNav();};
    const oldRefresh=window.refresh;
    window.refresh=function(){oldRefresh?.();applyPresetTheme();installThemeControls();renderProfile?.();syncBottomNav();renderHomeFeed();};
    // Existing theme/day/night controls should preserve the chosen color preset.
    const oldRenderTheme=window.renderTheme;
    window.renderTheme=function(){oldRenderTheme?.();applyPresetTheme();};
    renderHomeFeed();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
