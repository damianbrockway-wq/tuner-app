/* Pluck economy: "picks" currency + song unlocks + neon toast.
   Shared across pages. No dependencies. Safe to include in <head>. */
window.Pluck=(function(){
  var K_PICKS='pluckPicks', K_UNLOCK='pluckUnlocked';
  function picks(){return parseInt(localStorage.getItem(K_PICKS)||'0',10)||0;}
  function setPicks(n){try{localStorage.setItem(K_PICKS,String(Math.max(0,n|0)));}catch(e){}updateBadges();}
  function addPicks(n,reason){n=n|0;if(n<=0)return picks();setPicks(picks()+n);toast('🎸 +'+n+' pick'+(n>1?'s':'')+(reason?' · '+reason:''),'good');return picks();}
  function spend(n){n=n|0;if(picks()<n)return false;setPicks(picks()-n);return true;}
  function unlocked(){try{var a=JSON.parse(localStorage.getItem(K_UNLOCK)||'[]');return Array.isArray(a)?a:[];}catch(e){return[];}}
  function hasUnlock(id){return unlocked().indexOf(id)>=0;}
  function unlock(id){if(!id||hasUnlock(id))return false;var u=unlocked();u.push(id);try{localStorage.setItem(K_UNLOCK,JSON.stringify(u));}catch(e){}updateBadges();return true;}
  /* one-time reward per lesson (idempotent) */
  function awardLesson(n,guitar){var key='pluckPL'+(guitar?'g':'')+n;if(localStorage.getItem(key))return 0;try{localStorage.setItem(key,'1');}catch(e){}var amt=3;setPicks(picks()+amt);toast('🎸 +'+amt+' picks · lesson '+n+' cleared!','good');return amt;}
  function updateBadges(){try{var v=picks();document.querySelectorAll('[data-picks]').forEach(function(el){el.textContent='🎸 '+v;});}catch(e){}}
  /* neon toast */
  var _tinit=false;
  function _ensureStyle(){if(_tinit)return;_tinit=true;var s=document.createElement('style');
    s.textContent='#pk-toasts{position:fixed;left:0;right:0;top:14px;z-index:99999;display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}'+
    '.pk-toast{pointer-events:none;font-weight:800;font-size:14px;letter-spacing:.3px;color:#fff;padding:10px 16px;border-radius:999px;background:linear-gradient(90deg,#3a0d5c,#ff2e88);box-shadow:0 6px 22px rgba(255,46,136,.45),0 0 0 1px rgba(0,255,247,.25) inset;transform:translateY(-12px);opacity:0;animation:pkin .28s ease-out forwards, pkout .4s ease-in forwards;animation-delay:0s,2.1s}'+
    '.pk-toast.good{background:linear-gradient(90deg,#0b3b2e,#27e0a0);color:#04120d;box-shadow:0 6px 22px rgba(39,224,160,.4),0 0 0 1px rgba(0,255,247,.2) inset}'+
    '@keyframes pkin{from{transform:translateY(-12px);opacity:0}to{transform:translateY(0);opacity:1}}'+
    '@keyframes pkout{to{transform:translateY(-8px);opacity:0}}';
    document.head.appendChild(s);}
  function toast(msg,kind,ms){try{_ensureStyle();var host=document.getElementById('pk-toasts');
    if(!host){host=document.createElement('div');host.id='pk-toasts';document.body.appendChild(host);}
    var t=document.createElement('div');t.className='pk-toast'+(kind?' '+kind:'');t.textContent=msg;host.appendChild(t);
    setTimeout(function(){if(t.parentNode)t.parentNode.removeChild(t);},ms||2700);}catch(e){}}
  document.addEventListener('DOMContentLoaded',updateBadges);
  return {picks:picks,addPicks:addPicks,spend:spend,unlocked:unlocked,hasUnlock:hasUnlock,unlock:unlock,awardLesson:awardLesson,updateBadges:updateBadges,toast:toast};
})();
