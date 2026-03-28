import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ============================================================
// ✏️ REMPLIS LES CROCHETS [ ] AVEC TES VRAIES INFOS
// ============================================================
const INFO = {
  prenom_nom:   'Thomas Pagnon',
  nom_commercial: '[Ton Nom Commercial]',
  adresse:      '[Ton Adresse]',
  siren:        '[Ton Numéro SIREN]',
  ville_rcs:    '[Ta Ville]',
  email:        '[Ton Email Pro]',
  mediateur:    '[Nom du médiateur, ex: CM2C ou FEVAD]',
  lien_odr:     '[Lien plateforme ODR Commission Européenne]',
};
// ============================================================

const TEXTES = {
  en: {
    titre: 'Legal Information', lang: 'FR',
    onglets: ['LEGAL NOTICE','TERMS & CONDITIONS','RETURNS','PRIVACY','SHIPPING','DISPUTES'],
    sections: [
      { titre: 'Legal Notice', rows: [
        ['Owner', INFO.prenom_nom],
        ['Company', INFO.nom_commercial],
        ['Headquarters', INFO.adresse],
        ['SIREN', INFO.siren],
        ['Registration', `Registered at the RCS of ${INFO.ville_rcs}`],
        ['Contact', INFO.email],
        ['Host', 'OVH SAS, 2 rue Kellermann, 59100 Roubaix, France.'],
        ['Publication Director', INFO.prenom_nom],
      ]},
      { titre: 'Terms & Conditions', cols: [
        ['Products', 'Items are second-hand and sold in the condition described. Variations in color or minor wear are inherent to vintage/used items.'],
        ['Product Accuracy', "We make every effort to display colors and details accurately. Minor color variations are not considered defects."],
        ['Price', 'All prices are in Euros (€). VAT not applicable, art. 293 B of the French Tax Code (CGI).'],
        ['Errors and Omissions', 'In the event of an obvious pricing error, we reserve the right to correct it and cancel the order if necessary, even after confirmation.'],
        ['Shipping Fees', 'Shipping costs are calculated at checkout based on destination and weight.'],
        ['Customs & Taxes', 'For orders outside the EU, the buyer is the importer. Any customs duties or import fees are the sole responsibility of the buyer.'],
        ['Delivery', 'We ship worldwide. We are not responsible for delays caused by customs or postal services once the item has left France.'],
        ['Responsibility', 'We are not responsible for delays or damages caused by carrier services (Post, DHL, etc.).'],
        ['Authenticity', 'Every item is carefully selected and undergoes a thorough internal inspection before being listed.'],
        ['Independent Reseller', 'We are an independent reseller of pre-owned luxury goods. We are not affiliated with, or sponsored by, the brands we sell.'],
        ['Claims', 'If you have any concerns regarding authenticity, you must contact us within 14 days of receipt.'],
        ['Condition for Refund', 'A refund for authenticity concerns will only be considered if the security tag is still intact and attached to the item.'],
        ['Last Updated', 'April 2026 — Occitanie, France.'],
      ]},
      { titre: 'Returns & Withdrawal', cols: [
        ['EU & UK Customers', 'In accordance with European law, you have 14 days from receipt to exercise your right of withdrawal.'],
        ['International Customers', 'All sales outside the EU and UK are FINAL. No returns or refunds accepted, unless the item is non-compliant with the description.'],
        ['Return Costs', 'Return shipping costs are strictly at the buyer\'s expense.'],
        ['Refund Delay', 'Refunds are processed within 14 days after we receive and inspect the item.'],
        ['Security Tag', 'Items must be returned with their original security tag still attached. Any removal renders the item ineligible for return and refund.'],
        ['Condition', 'Items must be returned in their original condition. Any damaged item will not be refunded.'],
        ['Damages', 'You must report any damage or discrepancy within 48 hours of receiving the package.'],
      ]},
      { titre: 'Privacy Policy & Cookies', cols: [
        ['Data Collection', 'We collect your name, address, and email only for order fulfillment. We do not sell your data.'],
        ['Hosting', 'Your data is securely stored on OVHcloud servers located in France.'],
        ['Payments', 'All transactions are processed via Stripe. We do not store your credit card information.'],
        ['Data Retention', 'In accordance with French law, order-related data is kept for 10 years for accounting purposes.'],
        ['Social Media', 'We use cookies for analytics and social media interactions (Instagram/TikTok). Manage your preferences via our cookie banner.'],
        ['Your Rights', `You can request the deletion of your personal data at any time by contacting us at ${INFO.email}.`],
        ['Cookies', 'We use Essential, Analytics, and Marketing cookies. You can manage your preferences through our cookie banner.'],
      ]},
      { titre: 'Shipping Policy', cols: [
        ['Processing', 'Orders are processed and dispatched from Occitanie, France within 2–3 business days.'],
        ['Rates', 'Shipping costs are calculated at checkout based on weight and destination.'],
        ['Delivery Estimates', 'France: 2–3 business days · Europe: 5–10 business days · International: 10–20 business days. These times are estimates only.'],
        ['Tracking', 'A tracking number will be sent to your email address as soon as your package is shipped.'],
        ['Customs', 'For orders outside the EU, any customs fees or import taxes are at the buyer\'s expense.'],
        ['Responsibility', 'We are not responsible for delays or issues caused by the carrier once the package has been dispatched.'],
        ['Warranty & Liability', 'All items benefit from the French legal warranty of conformity. We are not responsible for events beyond our control (Force Majeure).'],
        ['Applicable Law', 'These terms are governed by French law. Any disputes will be settled under the jurisdiction of French courts.'],
      ]},
      { titre: 'Dispute Resolution', cols: [
        ['Mediation', `In the event of a dispute, after a prior written request to our customer service, you may contact a consumer mediator: ${INFO.mediateur}.`],
        ['Online Platform', `The European Commission provides an online dispute resolution platform: ${INFO.lien_odr}.`],
        ['Applicable Law', 'These terms are governed by French law. Any dispute shall be subject to the jurisdiction of the competent French courts.'],
      ]},
    ]
  },
  fr: {
    titre: 'Informations Légales', lang: 'EN',
    onglets: ['MENTIONS LÉGALES','CGV','RETOURS','CONFIDENTIALITÉ','LIVRAISON','LITIGES'],
    sections: [
      { titre: 'Mentions Légales', rows: [
        ['Propriétaire', INFO.prenom_nom],
        ['Société', INFO.nom_commercial],
        ['Siège social', INFO.adresse],
        ['SIREN', INFO.siren],
        ['Immatriculation', `Immatriculé au RCS de ${INFO.ville_rcs}`],
        ['Contact', INFO.email],
        ['Hébergeur', 'OVH SAS, 2 rue Kellermann, 59100 Roubaix, France.'],
        ['Directeur de publication', INFO.prenom_nom],
      ]},
      { titre: 'Conditions Générales de Vente', cols: [
        ['Produits', "Les articles sont d'occasion et vendus dans l'état décrit. Des variations de couleur ou légère usure sont inhérentes aux articles vintage."],
        ['Exactitude', "Nous faisons tout notre possible pour afficher les couleurs avec précision. Les légères variations ne sont pas considérées comme des défauts."],
        ['Prix', 'Tous les prix sont en Euros (€). TVA non applicable, art. 293 B du CGI.'],
        ['Erreurs', "En cas d'erreur de prix évidente, nous nous réservons le droit de corriger l'erreur et d'annuler la commande, même après confirmation."],
        ['Frais de port', 'Les frais de livraison sont calculés au moment du paiement en fonction de la destination et du poids.'],
        ['Douanes & Taxes', "Hors UE, l'acheteur est l'importateur. Tous droits de douane et taxes locales sont à sa charge exclusive."],
        ['Livraison', "Nous livrons dans le monde entier. Nous ne sommes pas responsables des retards douaniers une fois l'article parti de France."],
        ['Responsabilité', 'Nous ne sommes pas responsables des retards ou dommages causés par les transporteurs (La Poste, DHL, etc.).'],
        ['Authenticité', "Chaque article est soigneusement sélectionné et fait l'objet d'une inspection interne approfondie avant d'être mis en vente."],
        ['Revendeur indépendant', "Nous sommes un revendeur indépendant de produits de luxe d'occasion. Nous ne sommes pas affiliés aux marques que nous vendons."],
        ['Réclamations', "Pour toute question d'authenticité, vous devez nous contacter dans les 14 jours suivant la réception."],
        ['Condition de remboursement', "Un remboursement pour authenticité ne sera envisagé que si l'étiquette de sécurité est toujours intacte."],
        ['Dernière mise à jour', 'Avril 2026 — Occitanie, France.'],
      ]},
      { titre: 'Retours & Rétractation', cols: [
        ['Clients UE & UK', 'Conformément au droit européen, vous disposez de 14 jours à compter de la réception pour exercer votre droit de rétractation.'],
        ['Clients Internationaux', 'Toutes les ventes hors UE et UK sont DÉFINITIVES. Aucun retour accepté, sauf article non conforme à la description.'],
        ['Frais de retour', "Les frais de retour sont strictement à la charge de l'acheteur."],
        ['Délai de remboursement', "Les remboursements sont traités dans les 14 jours suivant la réception et l'inspection de l'article."],
        ['Étiquette de sécurité', "Les articles doivent être retournés avec leur étiquette de sécurité d'origine. Tout retrait rendra l'article inéligible au remboursement."],
        ['État', "Les articles doivent être retournés dans leur état d'origine. Tout article endommagé ne sera pas remboursé."],
        ['Dommages', 'Tout dommage doit être signalé dans les 48 heures suivant la réception du colis.'],
      ]},
      { titre: 'Confidentialité & Cookies', cols: [
        ['Collecte de données', 'Nous collectons nom, adresse et email uniquement pour le traitement des commandes. Nous ne vendons pas vos données.'],
        ['Hébergement', 'Vos données sont stockées de manière sécurisée sur les serveurs OVHcloud situés en France.'],
        ['Paiements', 'Toutes les transactions sont traitées via Stripe. Nous ne stockons pas vos informations bancaires.'],
        ['Conservation', 'Conformément à la loi française, les données de commandes sont conservées 10 ans à des fins comptables.'],
        ['Réseaux sociaux', 'Nous utilisons des cookies pour les analyses et les interactions Instagram/TikTok. Gérez vos préférences via notre bandeau cookies.'],
        ['Vos droits', `Vous pouvez demander la suppression de vos données à tout moment via ${INFO.email}.`],
        ['Cookies', 'Nous utilisons des cookies Essentiels, Analytiques et Marketing. Gérez vos préférences via notre bandeau cookies.'],
      ]},
      { titre: 'Politique de Livraison', cols: [
        ['Traitement', "Les commandes sont traitées et expédiées depuis l'Occitanie, France sous 2 à 3 jours ouvrés."],
        ['Tarifs', 'Les frais de livraison sont calculés au moment du paiement selon le poids et la destination.'],
        ['Délais estimés', 'France : 2–3 jours ouvrés · Europe : 5–10 jours ouvrés · International : 10–20 jours ouvrés. Ces délais sont indicatifs.'],
        ['Suivi', 'Un numéro de suivi vous sera envoyé par email dès expédition.'],
        ['Douanes', "Hors UE, tous frais de douane ou taxes d'importation sont à la charge de l'acheteur."],
        ['Responsabilité', "Nous ne sommes pas responsables des retards causés par le transporteur une fois le colis expédié."],
        ['Garantie & Force Majeure', "Tous les articles bénéficient de la garantie légale de conformité française. Nous ne sommes pas responsables des événements hors de notre contrôle."],
        ['Droit applicable', 'Ces conditions sont régies par le droit français. Tout litige sera réglé sous la juridiction des tribunaux français.'],
      ]},
      { titre: 'Résolution des Litiges', cols: [
        ['Médiation', `En cas de litige, après demande écrite préalable, vous pouvez contacter un médiateur de la consommation : ${INFO.mediateur}.`],
        ['Plateforme en ligne', `La Commission Européenne met à disposition une plateforme de règlement en ligne des litiges : ${INFO.lien_odr}.`],
        ['Droit applicable', 'Les présentes conditions sont régies par le droit français. Tout litige sera soumis à la compétence des tribunaux français.'],
      ]},
    ]
  }
};


@Component({
  selector: 'app-legal',
  imports: [CommonModule,FormsModule],
  templateUrl: './legal.component.html',
  styleUrl: './legal.component.scss',
})
export class LegalComponent {

  langue: 'en' | 'fr' = 'en';
  ongletActif = 0;
  cookiePopupOuvert = false;
  analyticsActif = false;
  marketingActif = false;

  get t() { return TEXTES[this.langue]; }
  get section() { return this.t.sections[this.ongletActif]; }

  changerLangue() { this.langue = this.langue === 'en' ? 'fr' : 'en'; }
  ouvrirCookies() { this.cookiePopupOuvert = true; }
  fermerCookies() { this.cookiePopupOuvert = false; }
  sauvegarder() { this.cookiePopupOuvert = false; }




}
