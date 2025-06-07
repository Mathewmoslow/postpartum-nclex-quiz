import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check, X, Clock, Award, BookOpen, RefreshCw } from 'lucide-react';

const PostpartumQuizApp = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());

  // NCLEX-style questions covering all major topics
  const questions = [
    // Immediate Postpartum Assessment (Questions 1-15)
    {
      id: 1,
      question: "A nurse is assessing a client 1 hour postpartum after vaginal delivery. The fundus is boggy and displaced to the right. What is the nurse's priority action?",
      options: [
        "Massage the fundus until firm",
        "Have the client empty her bladder",
        "Administer oxytocin as prescribed",
        "Document the findings as normal"
      ],
      correct: 1,
      rationale: "A displaced fundus to the right indicates bladder distention. The priority is to have the client void, as a full bladder prevents uterine contraction and increases hemorrhage risk."
    },
    {
      id: 2,
      question: "The nurse is teaching a postpartum client about lochia progression. Which statement by the client indicates understanding?",
      options: [
        "My discharge will be bright red for the first 2 weeks",
        "Pink discharge after 5 days means I'm hemorrhaging",
        "I should expect the discharge to change from red to pink to yellow-white",
        "The amount should increase each day as I become more active"
      ],
      correct: 2,
      rationale: "Lochia follows a predictable pattern: rubra (red, days 1-3), serosa (pink/brown, days 4-10), and alba (yellow-white, day 10+). This progression indicates normal healing."
    },
    {
      id: 3,
      question: "A postpartum client saturates a perineal pad in 15 minutes. The nurse's immediate action should be to:",
      options: [
        "Document this as a normal finding",
        "Massage the fundus and notify the provider",
        "Encourage the client to ambulate",
        "Apply ice to the perineum"
      ],
      correct: 1,
      rationale: "Saturating a pad in 15 minutes indicates hemorrhage. Immediate fundal massage and provider notification are essential to prevent hypovolemic shock."
    },
    {
      id: 4,
      question: "When using the REEDA scale for perineal assessment, which finding would receive the highest score?",
      options: [
        "Mild edema limited to the perineum",
        "Ecchymosis less than 0.25 cm",
        "Deep wound separation",
        "Serosanguinous discharge"
      ],
      correct: 2,
      rationale: "The REEDA scale scores 0-3 for each component. Deep separation (approximation) receives 3 points, indicating the most severe finding requiring intervention."
    },
    {
      id: 5,
      question: "A G3P3 client reports severe cramping while breastfeeding on postpartum day 2. The nurse should:",
      options: [
        "Assess for signs of infection",
        "Administer scheduled ibuprofen before feeding",
        "Discourage breastfeeding until cramping subsides",
        "Notify the provider of abnormal findings"
      ],
      correct: 1,
      rationale: "Afterpains are more severe in multiparous women and during breastfeeding due to oxytocin release. Scheduled pain medication 30 minutes before feeding provides relief."
    },
    {
      id: 6,
      question: "The nurse notes a postpartum client's temperature is 100.8°F (38.2°C) at 18 hours after delivery. What is the most appropriate action?",
      options: [
        "Administer antibiotics immediately",
        "Encourage oral fluids and recheck in 1 hour",
        "Apply cooling blankets",
        "Obtain blood cultures stat"
      ],
      correct: 1,
      rationale: "A low-grade fever up to 100.4°F (38°C) within 24 hours postpartum is often due to dehydration. Encouraging fluids and rechecking differentiates this from infection."
    },
    {
      id: 7,
      question: "During shift assessment, the nurse finds a postpartum client's fundus is firm, midline, and 3 cm above the umbilicus at 36 hours post-delivery. This finding indicates:",
      options: [
        "Normal involution",
        "Subinvolution",
        "Uterine atony",
        "Retained placental fragments"
      ],
      correct: 1,
      rationale: "The fundus should descend approximately 1 cm per day. At 36 hours, being 3 cm above the umbilicus suggests subinvolution, requiring further assessment."
    },
    {
      id: 8,
      question: "A breastfeeding mother on postpartum day 3 reports breast engorgement. The nurse should recommend:",
      options: [
        "Applying ice packs continuously",
        "Restricting fluids to decrease milk production",
        "Feeding every 2-3 hours and applying cold compresses between feeds",
        "Pumping to completely empty breasts after each feeding"
      ],
      correct: 2,
      rationale: "Frequent feeding helps relieve engorgement. Cold compresses between feeds reduce swelling. Continuous ice or fluid restriction can worsen the condition."
    },
    {
      id: 9,
      question: "Which assessment finding 4 hours postpartum requires immediate intervention?",
      options: [
        "Blood pressure 88/50 mmHg with dizziness",
        "Moderate lochia rubra with small clots",
        "Fundus firm at umbilicus level",
        "Temperature 99.2°F (37.3°C)"
      ],
      correct: 0,
      rationale: "Hypotension with symptoms suggests hypovolemic shock, possibly from hemorrhage. This requires immediate assessment and intervention to prevent complications."
    },
    {
      id: 10,
      question: "The nurse is caring for a client 24 hours post-cesarean. Which finding indicates normal recovery?",
      options: [
        "Absent bowel sounds",
        "Lochia alba",
        "Fundus 1 cm below umbilicus",
        "Temperature 101.5°F (38.6°C)"
      ],
      correct: 2,
      rationale: "The fundus descends about 1 cm daily. At 24 hours, 1 cm below the umbilicus is normal. Bowel sounds should return, lochia should be rubra, and fever indicates infection."
    },
    {
      id: 11,
      question: "A postpartum client has not voided in 5 hours. The nurse palpates a distended bladder. The priority intervention is to:",
      options: [
        "Encourage increased oral fluids",
        "Apply a warm compress to the perineum",
        "Perform an in-and-out catheterization",
        "Assist the client to the bathroom and run warm water"
      ],
      correct: 3,
      rationale: "Non-invasive measures should be tried first. Privacy, positioning, and warm water often stimulate voiding. Catheterization is used if conservative measures fail."
    },
    {
      id: 12,
      question: "When assessing for DVT risk in a postpartum client, which factor increases concern?",
      options: [
        "Early ambulation",
        "Breastfeeding",
        "Cesarean delivery",
        "Age 25 years"
      ],
      correct: 2,
      rationale: "Cesarean delivery increases DVT risk due to surgery, longer immobility, and higher clotting factors. Early ambulation reduces risk; breastfeeding and younger age are protective."
    },
    {
      id: 13,
      question: "A nurse notes foul-smelling lochia in a client 5 days postpartum. The priority assessment is:",
      options: [
        "Amount of lochia",
        "Fundal height",
        "Temperature and WBC count",
        "Perineal healing"
      ],
      correct: 2,
      rationale: "Foul-smelling lochia suggests endometritis. Temperature and WBC assessment help confirm infection requiring antibiotic treatment."
    },
    {
      id: 14,
      question: "The nurse teaches a postpartum client about warning signs. Which symptom requires immediate medical attention?",
      options: [
        "Breast tenderness while feeding",
        "Passing clots larger than a golf ball",
        "Mild cramping with breastfeeding",
        "Pink vaginal discharge on day 6"
      ],
      correct: 1,
      rationale: "Large clots indicate potential hemorrhage or retained placental tissue. This requires immediate evaluation to prevent complications."
    },
    {
      id: 15,
      question: "A postpartum client's hematocrit dropped from 35% to 28% since delivery. The nurse should first:",
      options: [
        "Administer iron supplements",
        "Assess blood pressure and pulse",
        "Encourage high-iron foods",
        "Prepare for blood transfusion"
      ],
      correct: 1,
      rationale: "A significant hematocrit drop suggests blood loss. Assessing vital signs for hypovolemia is the priority before implementing other interventions."
    },

    // Newborn Assessment & Adaptation (Questions 16-35)
    {
      id: 16,
      question: "A newborn has an APGAR score of 6 at 1 minute. The nurse should:",
      options: [
        "Begin chest compressions immediately",
        "Provide routine care and bonding",
        "Stimulate and provide oxygen as needed",
        "Prepare for immediate intubation"
      ],
      correct: 2,
      rationale: "APGAR 4-6 indicates moderate depression requiring stimulation and oxygen support. Scores below 4 require more aggressive resuscitation."
    },
    {
      id: 17,
      question: "Which finding in a 2-hour-old newborn requires immediate intervention?",
      options: [
        "Respiratory rate of 70 breaths/minute with grunting",
        "Heart rate of 140 beats/minute",
        "Axillary temperature of 97.8°F (36.6°C)",
        "Mild acrocyanosis of hands and feet"
      ],
      correct: 0,
      rationale: "Tachypnea (>60) with grunting indicates respiratory distress, possibly from retained lung fluid or other complications requiring immediate assessment."
    },
    {
      id: 18,
      question: "The nurse is teaching about newborn heat loss. Which mechanism causes the most rapid heat loss?",
      options: [
        "Radiation to cold windows",
        "Conduction from cold scales",
        "Convection from air currents",
        "Evaporation from wet skin"
      ],
      correct: 3,
      rationale: "Evaporation causes the most rapid heat loss, especially with amniotic fluid on skin. Immediate drying is essential to prevent hypothermia."
    },
    {
      id: 19,
      question: "During newborn assessment, the nurse notes the following: HR 88 bpm during sleep, pink color, responsive to stimuli. The appropriate action is:",
      options: [
        "Begin cardiac compressions",
        "Administer oxygen immediately",
        "Document as normal finding",
        "Stimulate the infant vigorously"
      ],
      correct: 2,
      rationale: "Heart rate 80-100 bpm is normal during deep sleep in newborns. Pink color and responsiveness indicate adequate perfusion."
    },
    {
      id: 20,
      question: "A term newborn's bilirubin level is 13 mg/dL at 30 hours of age. The nurse should:",
      options: [
        "Prepare for exchange transfusion",
        "Start phototherapy immediately",
        "Plot on nomogram and monitor",
        "Restrict breastfeeding"
      ],
      correct: 2,
      rationale: "Bilirubin levels must be interpreted based on age in hours using a nomogram. 13 mg/dL at 30 hours may be in the intermediate risk zone requiring monitoring."
    },
    {
      id: 21,
      question: "The nurse performs a Ballard score on a newborn. Which finding indicates full-term gestation?",
      options: [
        "Abundant lanugo covering the back",
        "Ear pinna remains folded when bent",
        "Plantar creases over entire sole",
        "Transparent, gelatinous skin"
      ],
      correct: 2,
      rationale: "Full plantar creases indicate maturity (term gestation). Abundant lanugo, poor ear recoil, and transparent skin suggest prematurity."
    },
    {
      id: 22,
      question: "When administering vitamin K to a newborn, the nurse should:",
      options: [
        "Use the deltoid muscle for injection",
        "Give 0.5 mg for all infants regardless of weight",
        "Administer in the vastus lateralis muscle",
        "Wait until 24 hours after birth"
      ],
      correct: 2,
      rationale: "Vitamin K is given IM in the vastus lateralis within 6 hours of birth. Dose is 0.5 mg for infants <1500g, 1 mg for larger infants."
    },
    {
      id: 23,
      question: "A newborn of a diabetic mother appears jittery and lethargic 2 hours after birth. The priority nursing action is:",
      options: [
        "Swaddle the infant tightly",
        "Check blood glucose level",
        "Place under radiant warmer",
        "Administer formula feeding"
      ],
      correct: 1,
      rationale: "IDMs (infants of diabetic mothers) are at high risk for hypoglycemia. Jitteriness and lethargy are classic signs requiring immediate glucose assessment."
    },
    {
      id: 24,
      question: "The nurse notes a cephalohematoma during newborn assessment. Parent teaching should include:",
      options: [
        "It will resolve within 24-48 hours",
        "It may take several weeks to months to resolve",
        "Immediate surgical drainage is needed",
        "It indicates brain damage occurred during delivery"
      ],
      correct: 1,
      rationale: "Cephalohematoma is blood between skull and periosteum that doesn't cross suture lines. It resolves slowly over weeks to months without intervention."
    },
    {
      id: 25,
      question: "Which newborn reflex assessment finding requires further evaluation?",
      options: [
        "Absent Moro reflex",
        "Positive Babinski reflex",
        "Strong sucking reflex",
        "Crossed extension reflex present"
      ],
      correct: 0,
      rationale: "Absence of the Moro (startle) reflex may indicate neurological problems or birth trauma. Other reflexes listed are normal findings."
    },
    {
      id: 26,
      question: "A newborn passes meconium at 36 hours of age. The nurse recognizes this as:",
      options: [
        "Abnormally delayed requiring immediate intervention",
        "Normal timing for first stool",
        "Sign of gastrointestinal obstruction",
        "Indication of formula intolerance"
      ],
      correct: 1,
      rationale: "90% of newborns pass meconium within 24 hours, but up to 48 hours is still normal. No intervention needed if infant is feeding well."
    },
    {
      id: 27,
      question: "During phototherapy for jaundice, which nursing intervention is priority?",
      options: [
        "Keeping the infant fully clothed",
        "Limiting fluid intake",
        "Monitoring temperature and hydration",
        "Maintaining NPO status"
      ],
      correct: 2,
      rationale: "Phototherapy increases insensible water loss and can cause temperature instability. Monitoring hydration and temperature while maximizing skin exposure is essential."
    },
    {
      id: 28,
      question: "The nurse assesses a 'barking' cry in a 4-hour-old newborn. This finding suggests:",
      options: [
        "Normal vocal cord function",
        "Possible neurological abnormality",
        "Hunger requiring immediate feeding",
        "Effective lung expansion"
      ],
      correct: 1,
      rationale: "A high-pitched, 'barking' or 'cat-like' cry may indicate neurological problems, genetic disorders, or increased intracranial pressure."
    },
    {
      id: 29,
      question: "Which assessment finding in a 24-hour-old newborn is most concerning?",
      options: [
        "Weight loss of 5% from birth weight",
        "Brick dust urine in diaper",
        "Respiratory rate of 28 breaths/minute",
        "Positive Ortolani maneuver"
      ],
      correct: 2,
      rationale: "Normal newborn respiratory rate is 30-60/minute. Rate below 30 indicates respiratory depression requiring immediate evaluation."
    },
    {
      id: 30,
      question: "A newborn's blood glucose is 38 mg/dL. After breastfeeding, the repeat level is 42 mg/dL. The nurse should:",
      options: [
        "Document normal improvement",
        "Administer IV dextrose immediately",
        "Supplement with formula feeding",
        "Recheck in 2 hours"
      ],
      correct: 2,
      rationale: "Blood glucose should be ≥45 mg/dL. Minimal improvement after feeding indicates need for supplementation to prevent neurological damage."
    },
    {
      id: 31,
      question: "The nurse is teaching parents about normal newborn behavior. Which statement indicates understanding?",
      options: [
        "My baby should sleep continuously for 6-hour periods",
        "Sneezing frequently means my baby has a cold",
        "My baby may have periods of rapid breathing followed by pauses",
        "Hiccups indicate overfeeding and should be prevented"
      ],
      correct: 2,
      rationale: "Periodic breathing (rapid breathing with brief pauses <20 seconds) is normal in newborns. Frequent sneezing and hiccups are also normal."
    },
    {
      id: 32,
      question: "Which intervention is most important when caring for a newborn with suspected sepsis?",
      options: [
        "Maintaining strict NPO status",
        "Isolating from other newborns",
        "Obtaining cultures before antibiotics",
        "Limiting parental contact"
      ],
      correct: 2,
      rationale: "Blood cultures must be obtained before antibiotic administration to identify the causative organism and guide treatment."
    },
    {
      id: 33,
      question: "The nurse notes asymmetric Moro reflex with limited movement of the right arm. This finding suggests:",
      options: [
        "Normal variation in reflex response",
        "Possible brachial plexus injury",
        "Need for immediate casting",
        "Cerebral palsy development"
      ],
      correct: 1,
      rationale: "Asymmetric Moro reflex with limited arm movement suggests brachial plexus injury (Erb's palsy) from birth trauma, requiring further evaluation."
    },
    {
      id: 34,
      question: "A 48-hour-old infant has lost 8% of birth weight. The appropriate nursing intervention is:",
      options: [
        "Continue current feeding plan",
        "Switch to exclusive formula feeding",
        "Evaluate feeding effectiveness and consider supplementation",
        "Begin IV fluid replacement"
      ],
      correct: 2,
      rationale: "Weight loss >7% by 48 hours indicates feeding problems. Assessment of latch, feeding frequency, and possible supplementation is needed."
    },
    {
      id: 35,
      question: "Which finding during newborn skin assessment requires immediate notification of the provider?",
      options: [
        "Mongolian spots on the lower back",
        "Erythema toxicum on the trunk",
        "Port wine stain over the eyelid",
        "Milia on the nose and cheeks"
      ],
      correct: 2,
      rationale: "Port wine stains near the eye may indicate Sturge-Weber syndrome with neurological involvement. Other options are benign skin variations."
    },

    // Infant Feeding (Questions 36-50)
    {
      id: 36,
      question: "A mother reports her 3-day-old infant 'isn't getting enough milk' because her breasts feel soft. The nurse's best response is:",
      options: [
        "You're right, you should supplement with formula",
        "Soft breasts mean your milk hasn't come in yet",
        "This is normal as your milk transitions and supply regulates",
        "You need to pump after each feeding to increase supply"
      ],
      correct: 2,
      rationale: "Around day 3, transitional milk replaces colostrum. Initial engorgement resolves as supply regulates. Soft breasts don't indicate insufficient milk."
    },
    {
      id: 37,
      question: "Which assessment finding indicates effective breastfeeding?",
      options: [
        "Infant falls asleep after 5 minutes at breast",
        "Mother reports severe nipple pain throughout feeding",
        "Audible swallowing with sustained sucking patterns",
        "Infant loses 12% of birth weight by day 4"
      ],
      correct: 2,
      rationale: "Audible swallowing and sustained sucking indicate effective milk transfer. Severe pain suggests poor latch; excessive weight loss indicates ineffective feeding."
    },
    {
      id: 38,
      question: "A breastfeeding mother asks about contraception. The nurse recommends:",
      options: [
        "Combined oral contraceptives starting immediately",
        "Breastfeeding alone is effective contraception for 6 months",
        "Progestin-only methods after milk supply is established",
        "No contraception needed while breastfeeding"
      ],
      correct: 2,
      rationale: "Progestin-only methods are safe for breastfeeding after 6 weeks. Combined hormones may decrease milk supply. LAM requires exclusive breastfeeding with specific criteria."
    },
    {
      id: 39,
      question: "When teaching formula preparation, the nurse emphasizes:",
      options: [
        "Microwave heating saves time and is safe",
        "Prepared bottles can be refrigerated for 48 hours",
        "Always discard remaining formula after feeding",
        "Concentrated formula doesn't require precise measuring"
      ],
      correct: 2,
      rationale: "Bacteria from the infant's mouth contaminate remaining formula. Microwaving creates hot spots; prepared formula is only safe for 24 hours refrigerated."
    },
    {
      id: 40,
      question: "A mother with flat nipples is having difficulty with infant latch. The nurse should first:",
      options: [
        "Recommend immediate use of nipple shields",
        "Suggest exclusive pumping and bottle feeding",
        "Teach breast compression and nipple stimulation techniques",
        "Advise formula supplementation until nipples evert"
      ],
      correct: 2,
      rationale: "Manual techniques often help flat nipples become more prominent for latch. Shields and alternative feeding methods should be last resorts."
    },
    {
      id: 41,
      question: "Which infant feeding pattern requires intervention?",
      options: [
        "Cluster feeding every hour for 3 hours in evening",
        "Sleeping 4 hours between feeds at night by 2 weeks",
        "Feeding only 5 times in 24 hours at 1 week old",
        "Taking 45 minutes to complete a breastfeeding session"
      ],
      correct: 2,
      rationale: "Newborns should feed 8-12 times per 24 hours. Only 5 feeds indicates inadequate intake risking dehydration and poor weight gain."
    },
    {
      id: 42,
      question: "A formula-feeding parent asks about normal stool patterns. The nurse explains:",
      options: [
        "Formula-fed infants should have 6-10 stools daily",
        "One stool every 2-3 days is typical",
        "Green stools always indicate illness",
        "Stools are firmer and less frequent than breastfed infants"
      ],
      correct: 3,
      rationale: "Formula produces firmer, less frequent stools (1-3/day) compared to breastfed infants. Color varies with formula type."
    },
    {
      id: 43,
      question: "The nurse observes a mother breastfeeding. Which observation requires intervention?",
      options: [
        "Infant's chin touching the breast",
        "Clicking sounds during feeding",
        "More areola visible above than below infant's mouth",
        "Mother supporting breast with C-hold"
      ],
      correct: 1,
      rationale: "Clicking sounds indicate shallow latch and ineffective seal, leading to poor milk transfer and nipple damage."
    },
    {
      id: 44,
      question: "A breastfeeding mother develops mastitis. The nurse advises:",
      options: [
        "Stop breastfeeding from affected breast immediately",
        "Apply ice continuously to reduce inflammation",
        "Continue frequent feeding and apply warm compresses",
        "Pump and discard milk until infection clears"
      ],
      correct: 2,
      rationale: "Continued breastfeeding helps clear infection. Warm compresses promote milk flow. Milk remains safe for infant during mastitis treatment."
    },
    {
      id: 45,
      question: "Which vitamin supplementation is recommended for exclusively breastfed infants?",
      options: [
        "Vitamin C daily from birth",
        "Vitamin D 400 IU daily",
        "Vitamin B12 weekly",
        "Vitamin A monthly"
      ],
      correct: 1,
      rationale: "Breast milk is low in vitamin D. AAP recommends 400 IU daily for all breastfed infants to prevent rickets."
    },
    {
      id: 46,
      question: "An infant shows signs of lactose intolerance. The appropriate formula recommendation is:",
      options: [
        "Standard cow's milk-based formula",
        "Soy-based formula",
        "Goat's milk formula",
        "Rice milk formula"
      ],
      correct: 1,
      rationale: "Soy-based formulas are lactose-free and appropriate for lactose intolerance. Rice and goat milk don't meet infant nutritional needs."
    },
    {
      id: 47,
      question: "A mother plans to return to work in 6 weeks. The nurse's teaching about pumping should include:",
      options: [
        "Start pumping the day before returning to work",
        "Pump only when feeling engorged",
        "Begin pumping once daily at 3-4 weeks postpartum",
        "Formula is necessary once returning to work"
      ],
      correct: 2,
      rationale: "Starting to pump at 3-4 weeks allows time to build a freezer stash and familiarize with pumping without interfering with supply establishment."
    },
    {
      id: 48,
      question: "Which finding indicates adequate nutrition in a 2-week-old infant?",
      options: [
        "Has regained birth weight",
        "Sleeps 6 hours between feeds",
        "Has 3 wet diapers daily",
        "Shows steady weight loss"
      ],
      correct: 0,
      rationale: "Infants should regain birth weight by 10-14 days. Adequate feeding produces 6+ wet diapers daily; 6-hour sleep stretches may indicate inadequate intake."
    },
    {
      id: 49,
      question: "The nurse teaches about growth spurts. Which information is accurate?",
      options: [
        "Growth spurts indicate low milk supply",
        "Supplementation is needed during growth spurts",
        "Increased feeding frequency is normal and temporary",
        "Growth spurts only occur at 6 months"
      ],
      correct: 2,
      rationale: "Growth spurts occur at predictable times (3 weeks, 6 weeks, 3 months) with increased feeding frequency that naturally boosts milk supply."
    },
    {
      id: 50,
      question: "A mother exclusively pumping asks about milk storage. The nurse correctly states:",
      options: [
        "Fresh milk can be refrigerated for 8 days",
        "Frozen milk is good for 12 months in deep freezer",
        "Thawed milk must be used within 1 hour",
        "Milk can be refrozen if not used"
      ],
      correct: 1,
      rationale: "Deep freezer (-4°F) storage allows 12 months. Regular freezer is 6 months. Thawed milk is good for 24 hours refrigerated; never refreeze."
    },

    // Psychosocial Adaptation & Family Care (Questions 51-65)
    {
      id: 51,
      question: "A postpartum client states, 'I just want to sleep and have everyone take care of me.' The nurse recognizes this as which phase?",
      options: [
        "Taking-in phase",
        "Taking-hold phase", 
        "Letting-go phase",
        "Postpartum depression"
      ],
      correct: 0,
      rationale: "The taking-in phase (0-2 days) involves passive behavior, focus on self-care needs, and reliving the birth experience. This is normal adaptation."
    },
    {
      id: 52,
      question: "Which behavior indicates successful maternal role attainment?",
      options: [
        "Calling the nurse for every diaper change",
        "Comparing her baby to others constantly",
        "Confidently comforting her crying infant",
        "Focusing only on following exact schedules"
      ],
      correct: 2,
      rationale: "Confident caregiving and responsive comforting indicate achievement of the personal phase of maternal role attainment."
    },
    {
      id: 53,
      question: "A father states he feels 'left out' since the baby arrived. The nurse's best response is:",
      options: [
        "This will pass once the baby gets older",
        "You should discuss this with your partner",
        "These feelings are common. Let's discuss ways you can be involved",
        "Focus on supporting the mother right now"
      ],
      correct: 2,
      rationale: "Acknowledging feelings and providing concrete involvement strategies supports paternal adaptation and family bonding."
    },
    {
      id: 54,
      question: "A 3-year-old sibling starts wetting the bed after the new baby arrives. The nurse explains this is:",
      options: [
        "Abnormal and needs immediate intervention",
        "A sign of urinary tract infection",
        "Common regression that usually resolves with support",
        "Deliberate attention-seeking behavior"
      ],
      correct: 2,
      rationale: "Regression is a normal response to new sibling stress. Consistent routines and individual attention help resolution."
    },
    {
      id: 55,
      question: "Which Edinburgh Postnatal Depression Scale score requires immediate intervention?",
      options: [
        "Score of 8",
        "Score of 11",
        "Score of 14 with positive response to question 10",
        "Score of 9 with tearfulness"
      ],
      correct: 2,
      rationale: "Score ≥13 indicates depression risk, but any positive response to question 10 (self-harm thoughts) requires immediate evaluation regardless of total score."
    },
    {
      id: 56,
      question: "A mother cries frequently and states 'I don't feel like myself' on postpartum day 4. The nurse should:",
      options: [
        "Screen for postpartum psychosis immediately",
        "Start antidepressant medication",
        "Reassure that 'baby blues' are normal and self-limiting",
        "Restrict visitors to reduce stress"
      ],
      correct: 2,
      rationale: "Baby blues affect 70-80% of mothers, peak around day 4-5, and resolve by 2 weeks. Support and normalization are appropriate."
    },
    {
      id: 57,
      question: "Which maternal behavior warrants further assessment for bonding difficulties?",
      options: [
        "Initially touching baby with fingertips",
        "Consistently avoiding eye contact with infant",
        "Asking many questions about infant care",
        "Expressing disappointment about infant's gender"
      ],
      correct: 1,
      rationale: "Persistent avoidance of eye contact suggests bonding difficulties. Initial fingertip touch and gender disappointment often resolve; questions indicate engagement."
    },
    {
      id: 58,
      question: "The nurse notes a mother calling her baby 'it' and showing little interest in holding the infant. Priority intervention is:",
      options: [
        "Document observations and continue monitoring",
        "Encourage skin-to-skin contact and model infant interaction",
        "Report to child protective services",
        "Arrange immediate psychiatric consultation"
      ],
      correct: 1,
      rationale: "Early intervention with bonding support often helps. Model caring behaviors and facilitate opportunities for positive interaction before assuming pathology."
    },
    {
      id: 59,
      question: "A teen mother states she wants to return to school but feels guilty about leaving her baby. The nurse should:",
      options: [
        "Encourage her to delay school until baby is older",
        "Discuss childcare options and maintaining bonding despite separation",
        "Suggest she choose between school and motherhood",
        "Tell her guilty feelings mean she shouldn't leave baby"
      ],
      correct: 1,
      rationale: "Supporting teen mothers' educational goals while maintaining infant bonding improves long-term outcomes for both mother and baby."
    },
    {
      id: 60,
      question: "Which intervention best supports grandparent adaptation to their new role?",
      options: [
        "Limiting their involvement to prevent interference",
        "Including them in teaching sessions with parents' permission",
        "Reminding them that parenting has changed",
        "Encouraging them to take over infant care"
      ],
      correct: 1,
      rationale: "Including grandparents in education (with permission) respects their role while supporting the parents' primary position."
    },
    {
      id: 61,
      question: "A mother states 'I love my baby but I don't feel that overwhelming joy others describe.' The nurse responds:",
      options: [
        "You may have postpartum depression",
        "Bonding happens differently for everyone and can develop over time",
        "Try to fake it until you feel it",
        "This suggests attachment disorder"
      ],
      correct: 1,
      rationale: "Normalizing different bonding experiences reduces anxiety. Instant overwhelming love isn't universal; bonding often develops gradually."
    },
    {
      id: 62,
      question: "During the taking-hold phase, which nursing intervention is most helpful?",
      options: [
        "Completing all infant care for the mother",
        "Providing detailed written instructions only",
        "Demonstrating care with return demonstration",
        "Limiting teaching to avoid overwhelming her"
      ],
      correct: 2,
      rationale: "During taking-hold (2-10 days), mothers are eager to learn. Hands-on practice with support builds confidence and competence."
    },
    {
      id: 63,
      question: "A father asks about resuming sexual activity. The nurse's best response includes:",
      options: [
        "Wait at least 6 weeks regardless of healing",
        "Resume when both partners feel ready and healing is complete",
        "Sexual activity should wait until breastfeeding stops",
        "This is something to discuss only with your partner"
      ],
      correct: 1,
      rationale: "No specific waiting period exists if healing is complete. Readiness varies by couple. Open communication and contraception planning are important."
    },
    {
      id: 64,
      question: "Which factor most significantly affects postpartum psychosocial adaptation?",
      options: [
        "Infant gender matching preferences",
        "Length of labor",
        "Social support system",
        "Maternal age"
      ],
      correct: 2,
      rationale: "Strong social support is the most protective factor for positive psychosocial adaptation, reducing risk of depression and improving coping."
    },
    {
      id: 65,
      question: "A mother who had an emergency cesarean expresses feelings of failure. The therapeutic response is:",
      options: [
        "At least you have a healthy baby",
        "Many women have cesareans successfully",
        "Tell me more about these feelings of failure",
        "You shouldn't feel that way"
      ],
      correct: 2,
      rationale: "Exploring feelings validates the mother's experience. Dismissive responses prevent processing of birth trauma and may impair adaptation."
    },

    // Complications & Emergency Care (Questions 66-80)
    {
      id: 66,
      question: "A postpartum client suddenly develops dyspnea, tachycardia, and chest pain. The nurse's priority action is:",
      options: [
        "Elevate the head of bed and administer oxygen",
        "Massage the fundus",
        "Obtain a 12-lead ECG",
        "Administer pain medication"
      ],
      correct: 0,
      rationale: "These symptoms suggest pulmonary embolism. Immediate oxygen and positioning to ease breathing are priorities while activating emergency response."
    },
    {
      id: 67,
      question: "Which client is at highest risk for postpartum hemorrhage?",
      options: [
        "G1P1 who delivered a 7-pound infant",
        "G4P4 with precipitous labor",
        "Cesarean delivery with regional anesthesia",
        "22-year-old with 18-hour labor"
      ],
      correct: 1,
      rationale: "Grand multiparity and precipitous labor are major risk factors for uterine atony and hemorrhage due to decreased uterine muscle tone."
    },
    {
      id: 68,
      question: "The nurse assesses HELLP syndrome in a postpartum client. Which finding confirms this diagnosis?",
      options: [
        "Hemoglobin 14 g/dL, elevated BP, low protein",
        "Hemolysis, elevated liver enzymes, low platelets",
        "High glucose, elevated lipids, low potassium",
        "Headache, elevated temperature, low blood pressure"
      ],
      correct: 1,
      rationale: "HELLP syndrome consists of Hemolysis, Elevated Liver enzymes, and Low Platelets - a severe complication of preeclampsia."
    },
    {
      id: 69,
      question: "A breastfeeding mother develops a red, wedge-shaped area on her breast with flu-like symptoms. The priority intervention is:",
      options: [
        "Discontinue breastfeeding immediately",
        "Apply ice continuously",
        "Begin antibiotics and continue breastfeeding",
        "Obtain milk culture before any treatment"
      ],
      correct: 2,
      rationale: "These symptoms indicate mastitis. Continued breastfeeding with antibiotic therapy is standard treatment. Cultures aren't necessary for initial treatment."
    },
    {
      id: 70,
      question: "Which assessment finding indicates developing preeclampsia in a postpartum client?",
      options: [
        "Blood pressure 142/92 with severe headache",
        "Temperature 100.2°F with chills",
        "Increased lochia with ambulation",
        "Ankle edema with prolonged standing"
      ],
      correct: 0,
      rationale: "Postpartum preeclampsia can develop up to 6 weeks after delivery. Hypertension with CNS symptoms requires immediate evaluation."
    },
    {
      id: 71,
      question: "A client reports heavy bleeding 2 weeks postpartum. The nurse should first assess for:",
      options: [
        "Infection signs",
        "Retained placental fragments",
        "Coagulation disorders",
        "Uterine rupture"
      ],
      correct: 1,
      rationale: "Late postpartum hemorrhage (>24 hours) is often caused by retained placental fragments preventing complete uterine involution."
    },
    {
      id: 72,
      question: "The nurse suspects necrotizing enterocolitis in a formula-fed newborn. Which symptom supports this?",
      options: [
        "Projectile vomiting after feeds",
        "Abdominal distention with bloody stools",
        "Yellow, seedy stools",
        "Constipation with hard stools"
      ],
      correct: 1,
      rationale: "NEC presents with abdominal distention, bloody stools, and feeding intolerance. It's more common in premature and formula-fed infants."
    },
    {
      id: 73,
      question: "A newborn develops central cyanosis during feeding. The immediate nursing action is:",
      options: [
        "Continue feeding in upright position",
        "Stop feeding and provide oxygen",
        "Burp the infant and resume feeding",
        "Switch to slower-flow nipple"
      ],
      correct: 1,
      rationale: "Central cyanosis during feeding suggests cardiac defect or severe respiratory compromise. Stop feeding immediately and provide respiratory support."
    },
    {
      id: 74,
      question: "Which finding indicates hypovolemic shock in a postpartum client?",
      options: [
        "Bradycardia with hypertension",
        "Decreased urine output with cool, clammy skin",
        "Elevated temperature with flushed skin",
        "Increased bowel sounds with diarrhea"
      ],
      correct: 1,
      rationale: "Hypovolemic shock presents with decreased perfusion signs: oliguria, cool/clammy skin, tachycardia, and hypotension."
    },
    {
      id: 75,
      question: "A client with gestational diabetes asks about future pregnancy risks. The nurse explains:",
      options: [
        "Diabetes only occurs during pregnancy",
        "50% chance of developing Type 2 diabetes within 10 years",
        "No increased risk after delivery",
        "Immediate Type 1 diabetes is expected"
      ],
      correct: 1,
      rationale: "Women with gestational diabetes have a 50% risk of developing Type 2 diabetes within 5-10 years, requiring lifestyle modification and monitoring."
    },
    {
      id: 76,
      question: "The nurse recognizes which sign as indicating postpartum thyroiditis?",
      options: [
        "Weight gain with cold intolerance at 3 months postpartum",
        "Immediate postpartum hair loss",
        "Increased appetite with weight gain",
        "Bradycardia with hypotension"
      ],
      correct: 0,
      rationale: "Postpartum thyroiditis often presents with hyperthyroid symptoms initially, then hypothyroid symptoms (weight gain, cold intolerance) around 3-6 months."
    },
    {
      id: 77,
      question: "A newborn with suspected congenital heart disease would most likely exhibit:",
      options: [
        "Pink color with strong peripheral pulses",
        "Cyanosis unrelieved by oxygen",
        "Respiratory rate of 40/minute",
        "Glucose level of 50 mg/dL"
      ],
      correct: 1,
      rationale: "Cyanotic heart disease causes right-to-left shunting, resulting in cyanosis that doesn't improve with oxygen administration."
    },
    {
      id: 78,
      question: "Which intervention is contraindicated for suspected placenta accreta?",
      options: [
        "Type and crossmatch blood",
        "Manual removal of placenta",
        "Prepare for possible hysterectomy",
        "Insert large-bore IV access"
      ],
      correct: 1,
      rationale: "Manual removal with placenta accreta can cause massive hemorrhage. Surgical intervention with possible hysterectomy is often required."
    },
    {
      id: 79,
      question: "A postpartum client develops unilateral leg swelling with positive Homans sign. The nurse should:",
      options: [
        "Massage the affected leg",
        "Apply warm compresses and elevate leg",
        "Encourage ambulation",
        "Keep leg elevated and notify provider"
      ],
      correct: 3,
      rationale: "Suspected DVT requires bed rest with elevation and immediate provider notification. Massage or ambulation could dislodge the clot."
    },
    {
      id: 80,
      question: "Which newborn condition requires immediate surgical consultation?",
      options: [
        "Epstein pearls on the palate",
        "Mongolian spots on buttocks",
        "Gastroschisis with exposed intestines",
        "Molding of cranial bones"
      ],
      correct: 2,
      rationale: "Gastroschisis is a surgical emergency requiring immediate protection of exposed intestines and surgical repair to prevent infection and fluid loss."
    },

    // Fluid/Electrolytes & Medications (Questions 81-100)
    {
      id: 81,
      question: "A postpartum client receiving magnesium sulfate has absent deep tendon reflexes. The nurse should:",
      options: [
        "Continue infusion and document finding",
        "Stop infusion and administer calcium gluconate",
        "Increase infusion rate",
        "Check serum magnesium level only"
      ],
      correct: 1,
      rationale: "Absent DTRs indicate magnesium toxicity. Stop infusion immediately and administer calcium gluconate as the antidote to prevent respiratory arrest."
    },
    {
      id: 82,
      question: "Which IV fluid is most appropriate for a postpartum client with hypovolemia?",
      options: [
        "0.45% sodium chloride",
        "Lactated Ringer's solution",
        "5% dextrose in water",
        "3% sodium chloride"
      ],
      correct: 1,
      rationale: "Lactated Ringer's is an isotonic crystalloid that expands intravascular volume effectively in hypovolemia without causing fluid shifts."
    },
    {
      id: 83,
      question: "A client's potassium level is 2.8 mEq/L. Which ECG change would the nurse expect?",
      options: [
        "Tall, peaked T waves",
        "Shortened QT interval",
        "Flattened T waves with U waves",
        "Widened QRS complex"
      ],
      correct: 2,
      rationale: "Hypokalemia causes flattened T waves and prominent U waves. Peaked T waves indicate hyperkalemia."
    },
    {
      id: 84,
      question: "The nurse notes infiltration of an IV containing oxytocin. The priority action is:",
      options: [
        "Apply warm compress to site",
        "Restart IV in same extremity",
        "Stop infusion and remove catheter",
        "Increase rate in current site"
      ],
      correct: 2,
      rationale: "Infiltrated oxytocin can cause tissue damage. Stop infusion immediately, remove catheter, and restart in opposite extremity."
    },
    {
      id: 85,
      question: "Which maternal condition contraindicates methylergonovine administration?",
      options: [
        "Postpartum hemorrhage",
        "Hypertension",
        "Anemia",
        "Gestational diabetes"
      ],
      correct: 1,
      rationale: "Methylergonovine causes vasoconstriction and is contraindicated in hypertension. It can cause dangerous blood pressure elevation."
    },
    {
      id: 86,
      question: "A newborn receiving phototherapy should be monitored for:",
      options: [
        "Hypoglycemia",
        "Fluid volume deficit",
        "Hypernatremia", 
        "Metabolic alkalosis"
      ],
      correct: 1,
      rationale: "Phototherapy increases insensible water loss, risking dehydration. Monitor intake/output and daily weights."
    },
    {
      id: 87,
      question: "Which electrolyte imbalance is most likely with prolonged oxytocin administration?",
      options: [
        "Hypernatremia",
        "Hyponatremia",
        "Hyperkalemia",
        "Hypercalcemia"
      ],
      correct: 1,
      rationale: "Oxytocin has antidiuretic properties causing water retention and dilutional hyponatremia with prolonged use."
    },
    {
      id: 88,
      question: "The nurse administers carboprost for postpartum hemorrhage. Which side effect requires monitoring?",
      options: [
        "Hypotension",
        "Diarrhea",
        "Urinary retention",
        "Bradycardia"
      ],
      correct: 1,
      rationale: "Carboprost (Hemabate) commonly causes GI side effects including diarrhea, nausea, and vomiting due to prostaglandin effects."
    },
    {
      id: 89,
      question: "A client receiving IV antibiotics develops red streaking up the arm. This indicates:",
      options: [
        "Normal medication effect",
        "Phlebitis",
        "Infiltration",
        "Extravasation"
      ],
      correct: 1,
      rationale: "Red streaking along the vein indicates phlebitis (vein inflammation). Discontinue IV and restart in opposite extremity."
    },
    {
      id: 90,
      question: "Which finding indicates fluid volume excess in a postpartum client?",
      options: [
        "Decreased urine output",
        "Crackles in lung bases",
        "Poor skin turgor",
        "Hypotension"
      ],
      correct: 1,
      rationale: "Crackles indicate fluid in alveoli from volume overload. Other options suggest fluid deficit."
    },
    {
      id: 91,
      question: "The nurse notes a client's calcium level is 7.2 mg/dL. Which medication should be available?",
      options: [
        "Vitamin D",
        "Calcium gluconate IV",
        "Calcitonin",
        "Phosphate binders"
      ],
      correct: 1,
      rationale: "Severe hypocalcemia (<7.5) requires IV calcium gluconate to prevent tetany and seizures. Oral supplements are too slow."
    },
    {
      id: 92,
      question: "Which intervention prevents complications from magnesium sulfate therapy?",
      options: [
        "Monitoring deep tendon reflexes hourly",
        "Restricting fluid intake",
        "Administering with meals",
        "Keeping client NPO"
      ],
      correct: 0,
      rationale: "DTRs are the best indicator of magnesium toxicity. Loss of reflexes precedes respiratory depression."
    },
    {
      id: 93,
      question: "A newborn's sodium level is 150 mEq/L. The nurse anticipates orders for:",
      options: [
        "3% sodium chloride",
        "0.9% sodium chloride", 
        "D5W infusion",
        "Sodium polystyrene"
      ],
      correct: 2,
      rationale: "Hypernatremia requires free water replacement. D5W provides water without sodium to correct the imbalance gradually."
    },
    {
      id: 94,
      question: "Which medication interaction is most concerning for a breastfeeding mother?",
      options: [
        "Ibuprofen and acetaminophen",
        "Warfarin and vitamin K foods",
        "Iron supplements and prenatal vitamins",
        "Stool softeners and fiber supplements"
      ],
      correct: 1,
      rationale: "Warfarin crosses into breast milk and dietary vitamin K affects its effectiveness. Close monitoring and consistent diet are essential."
    },
    {
      id: 95,
      question: "The nurse administers RhoGAM to an Rh-negative mother. Teaching should include:",
      options: [
        "This prevents sensitization to Rh-positive blood",
        "Protection lasts for all future pregnancies",
        "Administration must occur within 24 hours",
        "This treats existing Rh antibodies"
      ],
      correct: 0,
      rationale: "RhoGAM prevents Rh sensitization in current pregnancy only. It's given within 72 hours and doesn't treat existing antibodies."
    },
    {
      id: 96,
      question: "Which finding indicates therapeutic magnesium levels?",
      options: [
        "Absent reflexes",
        "Respiratory rate 10/minute",
        "Decreased urine output <30 mL/hour",
        "Deep tendon reflexes 2+"
      ],
      correct: 3,
      rationale: "Therapeutic magnesium maintains normal (2+) reflexes. Absent reflexes, respiratory depression, and oliguria indicate toxicity."
    },
    {
      id: 97,
      question: "A postpartum client with preeclampsia has a seizure. The priority intervention is:",
      options: [
        "Insert oral airway immediately",
        "Restrain client to prevent injury",
        "Turn client to side and suction PRN",
        "Increase magnesium sulfate rate"
      ],
      correct: 2,
      rationale: "Side positioning prevents aspiration and maintains airway. Never insert anything in mouth or restrain during seizure."
    },
    {
      id: 98,
      question: "Which laboratory finding requires immediate intervention in a postpartum client?",
      options: [
        "Hemoglobin 10.5 g/dL",
        "WBC 18,000/mm³",
        "Platelet count 75,000/mm³",
        "Hematocrit 33%"
      ],
      correct: 2,
      rationale: "Platelet count <100,000 indicates thrombocytopenia, risking hemorrhage. Mild anemia and elevated WBC are expected postpartum."
    },
    {
      id: 99,
      question: "The nurse prepares to administer hepatitis B vaccine to a newborn. The correct site is:",
      options: [
        "Deltoid muscle",
        "Vastus lateralis",
        "Ventrogluteal",
        "Subcutaneous tissue of thigh"
      ],
      correct: 1,
      rationale: "Vastus lateralis is the only safe IM injection site for newborns due to muscle mass. Deltoid isn't developed; vaccine is given IM, not SubQ."
    },
    {
      id: 100,
      question: "A client receiving terbutaline for preterm labor develops chest pain and shortness of breath. The nurse should:",
      options: [
        "Increase the infusion rate",
        "Stop the infusion immediately",
        "Administer oxygen only",
        "Document as expected side effect"
      ],
      correct: 1,
      rationale: "Chest pain and dyspnea with terbutaline suggest cardiac complications. Stop infusion immediately and notify provider. This is not an expected effect."
    }
  ];

  useEffect(() => {
    if (!startTime && Object.keys(answers).length > 0) {
      setStartTime(Date.now());
    }
  }, [answers, startTime]);

  useEffect(() => {
    if (startTime && !showResults) {
      const timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [startTime, showResults]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
    }));
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1] ?? '');
      setShowExplanation(false);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] ?? '');
      setShowExplanation(false);
    }
  };

  const toggleFlag = () => {
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(currentQuestion)) {
      newFlagged.delete(currentQuestion);
    } else {
      newFlagged.add(currentQuestion);
    }
    setFlaggedQuestions(newFlagged);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correct) correct++;
    });
    return correct;
  };

  const showQuizResults = () => {
    setShowResults(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setShowExplanation(false);
    setAnswers({});
    setShowResults(false);
    setStartTime(null);
    setElapsedTime(0);
    setFlaggedQuestions(new Set());
  };

  const getQuestionsByCategory = () => {
    const categories = {
      'Immediate Postpartum Assessment': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      'Newborn Assessment & Adaptation': [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
      'Infant Feeding': [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
      'Psychosocial Adaptation & Family Care': [51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65],
      'Complications & Emergency Care': [66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80],
      'Fluid/Electrolytes & Medications': [81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]
    };

    const categoryScores = {};
    Object.entries(categories).forEach(([category, questionIds]) => {
      const categoryQuestions = questionIds.map(id => questions[id - 1]);
      const correct = categoryQuestions.filter((q, idx) => 
        answers[questionIds[idx] - 1] === q.correct
      ).length;
      categoryScores[category] = {
        correct,
        total: questionIds.length,
        percentage: Math.round((correct / questionIds.length) * 100)
      };
    });
    return categoryScores;
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);
    const categoryScores = getQuestionsByCategory();
    const passed = percentage >= 75;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <Award className={`w-20 h-20 mx-auto mb-4 ${passed ? 'text-green-500' : 'text-red-500'}`} />
              <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
              <p className="text-xl text-gray-600">
                Your Score: {score}/{questions.length} ({percentage}%)
              </p>
              <p className={`text-lg mt-2 font-semibold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                {passed ? '✓ PASSED' : '✗ NEEDS IMPROVEMENT'}
              </p>
              <p className="text-gray-500 mt-2">Time: {formatTime(elapsedTime)}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Performance by Category</h2>
              <div className="space-y-3">
                {Object.entries(categoryScores).map(([category, data]) => (
                  <div key={category} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{category}</span>
                      <span className="text-sm text-gray-600">
                        {data.correct}/{data.total} ({data.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          data.percentage >= 75 ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${data.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Question Review</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {questions.map((q, idx) => {
                  const userAnswer = answers[idx];
                  const isCorrect = userAnswer === q.correct;
                  const wasAnswered = userAnswer !== undefined;
                  
                  return (
                    <div key={idx} className={`p-4 rounded-lg border ${
                      !wasAnswered ? 'bg-yellow-50 border-yellow-300' :
                      isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
                    }`}>
                      <div className="flex items-start gap-3">
                        <span className="font-bold text-gray-700">Q{idx + 1}.</span>
                        <div className="flex-1">
                          <p className="font-medium mb-2">{q.question}</p>
                          {!wasAnswered && (
                            <p className="text-yellow-700 text-sm">⚠️ Not answered</p>
                          )}
                          {wasAnswered && !isCorrect && (
                            <div className="text-sm">
                              <p className="text-red-700">
                                Your answer: {q.options[userAnswer]}
                              </p>
                              <p className="text-green-700">
                                Correct: {q.options[q.correct]}
                              </p>
                            </div>
                          )}
                          {isCorrect && (
                            <p className="text-green-700 text-sm">✓ Correct</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={resetQuiz}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const current = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                NCLEX Practice Quiz - Part 1
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>{formatTime(elapsedTime)}</span>
                </div>
                <button
                  onClick={toggleFlag}
                  className={`p-2 rounded-lg transition-colors ${
                    flaggedQuestions.has(currentQuestion) 
                      ? 'bg-yellow-100 text-yellow-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Flag question for review"
                >
                  🚩
                </button>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {current.question}
            </h2>
            
            <div className="space-y-3">
              {current.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === current.correct;
                const showFeedback = showExplanation;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showExplanation}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                      !showFeedback 
                        ? isSelected 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        : isSelected 
                          ? isCorrect 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-red-500 bg-red-50'
                          : isCorrect 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                        !showFeedback
                          ? isSelected
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                          : isSelected
                            ? isCorrect
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                            : isCorrect
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-600'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {showFeedback && (
                        <span className="flex-shrink-0">
                          {isCorrect && <Check className="w-6 h-6 text-green-600" />}
                          {isSelected && !isCorrect && <X className="w-6 h-6 text-red-600" />}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rationale */}
          {showExplanation && (
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Rationale:</h3>
              <p className="text-blue-800">{current.rationale}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                currentQuestion === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="flex gap-2">
              {Object.keys(answers).length === questions.length && (
                <button
                  onClick={showQuizResults}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Submit Quiz
                </button>
              )}
            </div>

            <button
              onClick={nextQuestion}
              disabled={currentQuestion === questions.length - 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                currentQuestion === questions.length - 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Question Navigator */}
          <div className="mt-8 pt-8 border-t">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Question Navigator</h3>
            <div className="grid grid-cols-10 gap-2">
              {questions.map((_, idx) => {
                const isAnswered = answers[idx] !== undefined;
                const isCurrent = idx === currentQuestion;
                const isFlagged = flaggedQuestions.has(idx);
                
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentQuestion(idx);
                      setSelectedAnswer(answers[idx] ?? '');
                      setShowExplanation(false);
                    }}
                    className={`h-10 rounded-lg text-sm font-medium transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                        : isAnswered
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } ${isFlagged ? 'ring-2 ring-yellow-400' : ''}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostpartumQuizApp;