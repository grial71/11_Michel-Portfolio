'use strict';
const questions = [
 {titre:'Un colis et une petite somme',message:'« Votre colis est bloqué. Payez 1,95 € dans les deux heures via ce lien. » Vous attendiez justement un colis.',choix:['Je paie : la somme est faible.','Je vérifie le suivi dans l’application ou sur le site officiel, sans utiliser ce lien.','Je réponds avec mon adresse.'],bonne:1,explication:'Attendre un colis ne garantit pas que le message soit authentique. Vérifiez le suivi par votre accès habituel au transporteur.'},
 {titre:'Un appel qui semble venir de votre banque',message:'Une personne vous demande un code reçu par SMS pour « empêcher une fraude ».',choix:['Je donne le code pour aller vite.','Je demande si elle connaît mon nom, puis je donne le code.','Je raccroche et contacte ma banque avec son numéro habituel.'],bonne:2,explication:'Un nom connu ou un numéro affiché ne suffit pas à identifier un appelant. Ne lui communiquez aucun code : reprenez contact vous-même avec la banque.'},
 {titre:'Un message impeccable',message:'Un e-mail contient un logo connu et ne fait aucune faute. Il demande de vous reconnecter via un bouton.',choix:['Cela suffit à prouver son authenticité.','Je passe par mon application ou mon favori habituel pour vérifier la demande.','Le logo prouve que je peux cliquer.'],bonne:1,explication:'Les logos et les textes soignés peuvent être copiés. Leur apparence ne prouve pas l’origine du message : vérifiez par un accès indépendant.'},
 {titre:'Une pièce jointe inattendue',message:'Un contact vous envoie une « facture urgente » que vous ne reconnaissez pas.',choix:['Je contacte cette personne par un moyen déjà connu avant de l’ouvrir.','Je l’ouvre pour comprendre.','Je la transfère à mes amis pour leur demander de l’ouvrir.'],bonne:0,explication:'Un compte peut être usurpé ou compromis. Confirmez la demande avec votre contact sans ouvrir ni diffuser la pièce jointe suspecte.'},
 {titre:'Un proche a un nouveau numéro',message:'« Mon téléphone est cassé. Voici mon nouveau numéro. Peux-tu faire un virement urgent ? »',choix:['Je verse l’argent puisque c’est un proche.','Je demande uniquement son prénom.','Je vérifie auprès du proche via un ancien numéro ou un autre contact fiable.'],bonne:2,explication:'L’urgence et l’identité annoncée ne sont pas des preuves. Vérifiez la situation par un autre canal avant toute décision.'}
];
const reponses = new Map();
const quiz = document.querySelector('#quiz');
function afficher(){
 quiz.replaceChildren(); reponses.clear(); document.querySelector('#bilan').hidden=true;
 questions.forEach((q,i)=>{
  const bloc=document.createElement('fieldset');bloc.className='question';
  const titre=document.createElement('legend');titre.textContent=`${i+1}/5 — ${q.titre}`;bloc.append(titre);
  const exemple=document.createElement('p');exemple.className='example';exemple.textContent=q.message;bloc.append(exemple);
  const choix=document.createElement('div');choix.className='choices';
  const retour=document.createElement('p');retour.className='feedback';retour.setAttribute('role','status');retour.hidden=true;
  q.choix.forEach((texte,j)=>{const bouton=document.createElement('button');bouton.type='button';bouton.textContent=texte; bouton.addEventListener('click',()=>{
   if(reponses.has(i))return;reponses.set(i,j);
   choix.querySelectorAll('button').forEach(b=>b.disabled=true);bouton.setAttribute('aria-pressed','true');
   retour.textContent=(j===q.bonne?'Bon réflexe ! ':'À retenir : ')+q.explication;retour.hidden=false;
   if(reponses.size===questions.length){const score=[...reponses].filter(([n,r])=>questions[n].bonne===r).length;document.querySelector('#score').textContent=`${score} bon${score>1?'s':''} réflexe${score>1?'s':''} sur 5. Relisez les explications et réessayez à votre rythme !`;document.querySelector('#bilan').hidden=false;document.querySelector('#bilan').focus();}
  });choix.append(bouton);});bloc.append(choix,retour);quiz.append(bloc);
 });
}
document.querySelector('#recommencer').addEventListener('click',()=>{afficher();quiz.querySelector('button').focus();});
document.querySelector('#partager').addEventListener('click',async()=>{
 const url='https://www.lenumeriquevientavous.fr/quiz-arnaques.html';const etat=document.querySelector('#partage-etat');
 try{if(navigator.share){await navigator.share({title:'Repérer les arnaques — le petit défi de Michel',text:'Cinq questions gratuites pour apprendre de bons réflexes numériques. Débutants bienvenus !',url});etat.textContent='';}else{await navigator.clipboard.writeText(url);etat.textContent='Lien copié ! Vous pouvez le coller dans votre message.';}}
 catch(e){etat.textContent=e.name==='AbortError'?'Partage annulé.':`Vous pouvez copier ce lien : ${url}`;}
});
afficher();
