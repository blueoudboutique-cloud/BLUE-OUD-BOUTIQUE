import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
export const supabase = createClient('https://eswsrdxhztgizqjnclnn.supabase.co','sb_publishable_eCOUMwrzy4sfyYrmkEXNEg_Vnc1hjwi',{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
let currency='YER'; export function setCurrency(v){if(['YER','SAR','USD'].includes(v))currency=v;} export const money=value=>new Intl.NumberFormat('ar',{style:'currency',currency,maximumFractionDigits:2}).format(Number(value||0)); const currencyResult=await supabase.from('store_settings').select('value').eq('key','currency').maybeSingle(); if(!currencyResult.error)setCurrency(currencyResult.data?.value?.text);
export const safe = value => String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function getCart(){try{const a=JSON.parse(localStorage.getItem('blueoud_cart_db')||'[]');return Array.isArray(a)?a.filter(x=>typeof x.id==='string'&&Number.isInteger(x.qty)&&x.qty>0&&x.qty<=100):[]}catch{return []}}
export function setCart(a){localStorage.setItem('blueoud_cart_db',JSON.stringify(a));window.dispatchEvent(new Event('cart-updated'))}
export function report(error){console.error(error);return error?.message||'Ø­Ø¯Ø« Ø®Ø·Ø£ ØºÙØ± ÙØªÙÙØ¹'}
