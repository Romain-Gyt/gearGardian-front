'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function Tutorials() {
    return (
        <div className="flex flex-1 flex-col gap-4 lg:gap-6">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">Tutoriels de Sécurité</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Guides essentiels sur la sécurité du matériel</CardTitle>
                    <CardDescription>
                        Apprenez à inspecter, entretenir et savoir quand mettre au rebut votre équipement d'escalade.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Comment inspecter votre corde d'escalade ?</AccordionTrigger>
                            <AccordionContent>
                                <p className="mb-2">Une inspection régulière est cruciale pour votre sécurité. Faites glisser la corde entre vos doigts sur toute sa longueur pour détecter toute anomalie.</p>
                                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                    <li><strong>Points de contrôle visuels :</strong> Recherchez des zones avec une gaine très pelucheuse, des décolorations, ou des endroits où l'âme est visible.</li>
                                    <li><strong>Points de contrôle tactiles :</strong> Soyez attentif aux zones molles ou rigides, aux variations de diamètre ou à toute sensation de "vide" à l'intérieur de la corde.</li>
                                    <li><strong>Après une chute importante :</strong> Mettez immédiatement votre corde au rebut si elle a subi une chute de facteur élevé (proche de 2) ou si elle a arrêté une chute sur une arête vive.</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Quand mettre au rebut un baudrier ?</AccordionTrigger>
                            <AccordionContent>
                                <p className="mb-2">Votre baudrier est votre lien de vie. Ne prenez aucun risque avec un matériel usé.</p>
                                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                    <li><strong>Usure des coutures :</strong> Inspectez toutes les coutures structurelles. Si des fils sont coupés, usés ou effilochés, le baudrier est à réformer.</li>
                                    <li><strong>Usure des sangles :</strong> Vérifiez les sangles, en particulier les pontets d'encordement et les porte-matériels. Une usure excessive, des brûlures ou des coupures sont des signes de danger.</li>
                                    <li><strong>Boucles :</strong> Assurez-vous que les boucles fonctionnent correctement, se serrent bien et ne glissent pas.</li>
                                    <li><strong>Date de péremption :</strong> Respectez toujours la durée de vie maximale indiquée par le fabricant (généralement 10 ans à partir de la date de fabrication, même sans utilisation).</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="item-3">
                            <AccordionTrigger>Inspection des mousquetons et dégaines</AccordionTrigger>
                            <AccordionContent>
                                <p className="mb-2">Les mousquetons peuvent durer longtemps, mais ne sont pas éternels. Une inspection minutieuse est nécessaire.</p>
                                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                    <li><strong>Fonctionnement du doigt :</strong> Le doigt doit se fermer complètement et rapidement. S'il est lent, tordu, ou ne se ferme pas correctement, nettoyez-le. Si le problème persiste, mettez-le au rebut.</li>
                                    <li><strong>Usure du corps :</strong> Recherchez des gorges profondes creusées par la corde, surtout sur les mousquetons en haut des voies. Une gorge de plus de 1-2 mm de profondeur affaiblit considérablement le mousqueton.</li>
                                    <li><strong>Fissures et déformations :</strong> Inspectez pour toute fissure, déformation ou signe de corrosion. Mettez au rebut immédiatement si vous en trouvez.</li>
                                    <li><strong>Après une chute :</strong> Un mousqueton qui a subi un choc violent (chute de hauteur, etc.) doit être mis au rebut même s'il ne présente pas de dommage visible.</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger>Comment inspecter votre casque d'escalade ?</AccordionTrigger>
                            <AccordionContent>
                                <p className="mb-2">Le casque protège votre tête des chutes de pierres et des impacts. Son inspection est vitale.</p>
                                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                    <li><strong>Coque externe :</strong> Recherchez des fissures, même fines, des bosses, des déformations ou une décoloration excessive due au soleil (fragilisation du plastique).</li>
                                    <li><strong>Coque interne (mousse) :</strong> Inspectez la mousse d'absorption des chocs pour des signes de compression, des fissures ou des morceaux manquants.</li>
                                    <li><strong>Sangles et boucle :</strong> Vérifiez l'état des sangles (pas d'effilochage, de coupures) et le bon fonctionnement de la boucle de fermeture.</li>
                                    <li><strong>Après un choc :</strong> Tout comme pour les autres EPI, un casque doit être mis au rebut après un impact important, même si aucun dommage n'est visible.</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-5">
                            <AccordionTrigger>Vérification de votre système d'assurage</AccordionTrigger>
                            <AccordionContent>
                                <p className="mb-2">Qu'il soit simple ou mécanique, votre assureur est une pièce maîtresse de la chaîne de sécurité.</p>
                                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                    <li><strong>Usure générale :</strong> Recherchez une usure excessive aux points de friction de la corde. Des gorges trop profondes peuvent créer des arêtes vives et endommager la corde.</li>
                                    <li><strong>Parties mobiles (pour les assureurs mécaniques) :</strong> Assurez-vous que la came ou les autres pièces mobiles fonctionnent sans a-coups, qu'elles ne sont pas encrassées et qu'elles reviennent bien en position.</li>
                                    <li><strong>Fissures et déformations :</strong> Examinez l'ensemble de l'appareil pour déceler toute fissure, déformation ou signe de corrosion.</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}
