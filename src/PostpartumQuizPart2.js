import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check, X, Clock, Award, BookOpen, RefreshCw } from 'lucide-react';

const PostpartumQuizPart2 = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());

  // NCLEX-style questions Part 2 - New questions covering same topics
  const questions = [
    // Immediate Postpartum Assessment (Questions 1-15)
    {
      id: 1,
      question: "A nurse assesses a postpartum client's perineum 8 hours after delivery and notes ecchymosis extending 1.5 cm bilaterally. Using the REEDA scale, what score should be assigned for this finding?",
      options: [
        "0 points",
        "1 point",
        "2 points",
        "3 points"
      ],
      correct: 3,
      rationale: "Ecchymosis >1 cm or bilateral receives 3 points on the REEDA scale, indicating significant bruising requiring monitoring and intervention."
    },
    {
      id: 2,
      question: "The nurse palpates a postpartum client's fundus and finds it firm, midline, but 4 fingerbreadths above the umbilicus at 24 hours post-delivery. What is the priority intervention?",
      options: [
        "Document as normal finding",
        "Encourage ambulation",
        "Assess for bladder distention",
        "Increase oxytocin infusion"
      ],
      correct: 2,
      rationale: "The fundus should be at or below the umbilicus by 24 hours. Elevation suggests bladder distention preventing normal descent."
    },
    {
      id: 3,
      question: "A postpartum client reports passing 'something large' while on the toilet. The nurse notes a large, dark red tissue mass. What should the nurse do first?",
      options: [
        "Flush the tissue",
        "Save the tissue for examination",
        "Reassure client this is normal",
        "Prepare for emergency surgery"
      ],
      correct: 1,
      rationale: "Large tissue should be saved for examination as it may be retained placental fragments, requiring provider evaluation for possible D&C."
    },
    {
      id: 4,
      question: "During postpartum assessment, the nurse notes a client's lochia has a sweet, unusual odor. This finding most likely indicates:",
      options: [
        "Normal lochia characteristics",
        "Dehydration",
        "Possible infection with Staphylococcus",
        "Retained placental fragments"
      ],
      correct: 2,
      rationale: "Sweet odor in lochia can indicate Staphylococcus infection. Normal lochia has an earthy, menstrual-like odor."
    },
    {
      id: 5,
      question: "A G1P1 client complains of difficulty initiating urination 6 hours postpartum. Which intervention should the nurse try first?",
      options: [
        "Insert indwelling catheter",
        "Administer bethanechol",
        "Pour warm water over the perineum",
        "Perform in-and-out catheterization"
      ],
      correct: 2,
      rationale: "Non-invasive measures like warm water, privacy, and positioning should be attempted first. Catheterization is reserved for when conservative measures fail."
    },
    {
      id: 6,
      question: "The nurse caring for a postpartum client notes blood pressure 138/88, headache, and 2+ proteinuria. The client had no hypertension during pregnancy. This indicates:",
      options: [
        "Normal postpartum changes",
        "Dehydration",
        "Postpartum preeclampsia",
        "Chronic hypertension"
      ],
      correct: 2,
      rationale: "Preeclampsia can develop up to 6 weeks postpartum. New-onset hypertension with proteinuria and CNS symptoms requires immediate evaluation."
    },
    {
      id: 7,
      question: "A nurse teaches perineal care to a postpartum client. Which client action indicates need for further teaching?",
      options: [
        "Wiping from back to front after voiding",
        "Changing pads every 2-3 hours",
        "Using the peri-bottle with warm water",
        "Patting the area dry"
      ],
      correct: 0,
      rationale: "Wiping should always be front to back to prevent contamination of the perineum with fecal bacteria, reducing infection risk."
    },
    {
      id: 8,
      question: "At 48 hours postpartum, a client's WBC count is 22,000/mm³. The nurse should:",
      options: [
        "Notify the provider immediately",
        "Start prophylactic antibiotics",
        "Document as expected finding",
        "Obtain blood cultures"
      ],
      correct: 2,
      rationale: "WBC elevation up to 30,000/mm³ is normal in early postpartum due to stress of labor. Other signs of infection should be assessed."
    },
    {
      id: 9,
      question: "The nurse notes a postpartum client has saturated 3 perineal pads in the last hour. After confirming the fundus is firm, the next action is:",
      options: [
        "Continue to monitor",
        "Check for vaginal or cervical lacerations",
        "Encourage breastfeeding",
        "Administer ergotamine"
      ],
      correct: 1,
      rationale: "Heavy bleeding with a firm fundus suggests lacerations. The birth canal should be examined for unrepaired tears causing hemorrhage."
    },
    {
      id: 10,
      question: "A postpartum client's hematocrit on admission was 34%. Today, postpartum day 2, it is 30%. The nurse recognizes this as:",
      options: [
        "Significant blood loss requiring transfusion",
        "Normal hemodilution",
        "Laboratory error",
        "Dehydration"
      ],
      correct: 1,
      rationale: "Hematocrit typically drops 2-4 points postpartum due to hemodilution as interstitial fluid returns to circulation. This is normal."
    },
    {
      id: 11,
      question: "A client is 3 hours post-cesarean delivery. Which assessment finding requires immediate intervention?",
      options: [
        "Fundus palpable at umbilicus",
        "Serosanguinous drainage on dressing",
        "Absence of bowel sounds",
        "Urine output 20 mL/hour"
      ],
      correct: 3,
      rationale: "Urine output <30 mL/hour indicates inadequate renal perfusion, possibly from hemorrhage or dehydration, requiring immediate intervention."
    },
    {
      id: 12,
      question: "The nurse assesses a postpartum client's episiotomy and notes dehiscence. The priority nursing diagnosis is:",
      options: [
        "Risk for infection",
        "Acute pain",
        "Impaired tissue integrity",
        "Anxiety"
      ],
      correct: 0,
      rationale: "Open wound from dehiscence creates immediate infection risk. While other diagnoses apply, preventing infection is the priority."
    },
    {
      id: 13,
      question: "A breastfeeding mother's fundus deviates to the left despite recent voiding. The nurse should assess for:",
      options: [
        "Uterine atony",
        "Distended bladder",
        "Hematoma formation",
        "Normal involution"
      ],
      correct: 2,
      rationale: "Fundal deviation despite empty bladder may indicate hematoma formation displacing the uterus. This requires immediate assessment."
    },
    {
      id: 14,
      question: "During shift assessment, the nurse notes a postpartum client's pad has 50% saturation with bright red blood and one golf-ball sized clot. This represents:",
      options: [
        "Light flow",
        "Moderate flow",
        "Heavy flow",
        "Excessive flow"
      ],
      correct: 2,
      rationale: "50% pad saturation indicates moderate to heavy flow. The golf-ball sized clot elevates this to heavy flow requiring close monitoring."
    },
    {
      id: 15,
      question: "A postpartum client develops tachycardia, tachypnea, and oxygen saturation of 88%. The nurse suspects:",
      options: [
        "Normal postpartum changes",
        "Anxiety attack",
        "Pulmonary embolism",
        "Pneumonia"
      ],
      correct: 2,
      rationale: "Sudden onset of tachycardia, tachypnea, and hypoxia suggests pulmonary embolism, a life-threatening complication requiring emergency intervention."
    },

    // Newborn Assessment & Adaptation (Questions 16-35)
    {
      id: 16,
      question: "A newborn's initial temperature is 96.8°F. After skin-to-skin contact for 30 minutes, the temperature is 97.2°F. The nurse should:",
      options: [
        "Continue skin-to-skin contact",
        "Place under radiant warmer",
        "Give warm formula",
        "Obtain blood glucose"
      ],
      correct: 1,
      rationale: "Temperature <97.7°F after intervention indicates need for more aggressive warming. Radiant warmer provides consistent heat for cold-stressed infants."
    },
    {
      id: 17,
      question: "During newborn assessment, the nurse notes nasal flaring and intercostal retractions with a respiratory rate of 72/minute. The priority action is:",
      options: [
        "Document findings and monitor",
        "Suction with bulb syringe",
        "Provide blow-by oxygen",
        "Notify the provider immediately"
      ],
      correct: 3,
      rationale: "Multiple signs of respiratory distress (tachypnea >60, retractions, flaring) require immediate provider notification for evaluation and intervention."
    },
    {
      id: 18,
      question: "The nurse observes a newborn having rapid, shallow breathing for 15 seconds followed by a 10-second pause. This pattern indicates:",
      options: [
        "Normal periodic breathing",
        "Apnea requiring intervention",
        "Respiratory distress syndrome",
        "Transient tachypnea"
      ],
      correct: 0,
      rationale: "Periodic breathing with pauses <20 seconds is normal in newborns. Apnea is defined as cessation of breathing >20 seconds."
    },
    {
      id: 19,
      question: "A term newborn has not passed meconium by 48 hours. The nurse should first:",
      options: [
        "Give glycerin suppository",
        "Increase feeding frequency",
        "Assess for abdominal distention",
        "Prepare for barium enema"
      ],
      correct: 2,
      rationale: "Failure to pass meconium by 48 hours requires assessment for intestinal obstruction. Abdominal distention would support this concern."
    },
    {
      id: 20,
      question: "The nurse notes a newborn's cry is weak and high-pitched. This finding is most associated with:",
      options: [
        "Hunger",
        "Normal variation",
        "Neurological problems",
        "Respiratory distress"
      ],
      correct: 2,
      rationale: "High-pitched, weak cry suggests neurological involvement such as increased intracranial pressure, brain injury, or genetic disorders."
    },
    {
      id: 21,
      question: "During Ballard scoring, a newborn demonstrates full arm recoil, resistant extension past 90 degrees at popliteal angle, and ears with instant recoil. This indicates:",
      options: [
        "Extreme prematurity",
        "Moderate prematurity",
        "Term gestation",
        "Post-term gestation"
      ],
      correct: 2,
      rationale: "Strong muscle tone with good flexion and recoil indicates neuromuscular maturity consistent with term gestation (37-42 weeks)."
    },
    {
      id: 22,
      question: "A newborn's blood glucose is 35 mg/dL after initial feeding. The nurse should:",
      options: [
        "Document and recheck in 1 hour",
        "Give oral glucose gel and refeed",
        "Start IV dextrose infusion",
        "Check temperature first"
      ],
      correct: 1,
      rationale: "Glucose 25-40 mg/dL can be treated with oral glucose gel and refeeding. IV dextrose is reserved for levels <25 or failure of oral treatment."
    },
    {
      id: 23,
      question: "The nurse assesses a 36-hour-old newborn with visible jaundice extending to the chest. The appropriate action is:",
      options: [
        "Document as physiologic jaundice",
        "Encourage frequent feedings only",
        "Obtain transcutaneous bilirubin level",
        "Start phototherapy immediately"
      ],
      correct: 2,
      rationale: "Visible jaundice progressing to chest by 36 hours requires bilirubin measurement to determine if phototherapy is needed based on hour-specific nomogram."
    },
    {
      id: 24,
      question: "A newborn demonstrates the Moro reflex when the right arm is stimulated but not the left. This suggests:",
      options: [
        "Normal asymmetry",
        "Erb's palsy",
        "Cerebral palsy",
        "Fractured clavicle"
      ],
      correct: 3,
      rationale: "Absent Moro on one side with normal response on the other often indicates clavicular fracture, common with difficult deliveries."
    },
    {
      id: 25,
      question: "The nurse notes that a 4-hour-old newborn has excessive oral secretions and choking with first feeding attempt. This finding suggests:",
      options: [
        "Normal mucus production",
        "Tracheoesophageal fistula",
        "Poor suck reflex",
        "Overfeeding"
      ],
      correct: 1,
      rationale: "Excessive secretions with choking on first feed is classic for TEF/esophageal atresia. Feeding should stop pending evaluation."
    },
    {
      id: 26,
      question: "A newborn's axillary temperature is 99.8°F. The nurse should:",
      options: [
        "Remove blankets and recheck",
        "Give acetaminophen",
        "Obtain blood cultures",
        "Document as normal"
      ],
      correct: 0,
      rationale: "Temperature >99.5°F indicates hyperthermia, often from overbundling. Environmental cooling should be tried first before assuming infection."
    },
    {
      id: 27,
      question: "During cardiac assessment, the nurse hears a grade 2/6 systolic murmur in a 12-hour-old newborn. This most likely represents:",
      options: [
        "Ventricular septal defect",
        "Closing ductus arteriosus",
        "Tetralogy of Fallot",
        "Coarctation of aorta"
      ],
      correct: 1,
      rationale: "Soft systolic murmurs in first 24-48 hours usually represent normal transition as ductus arteriosus closes. Persistent or loud murmurs need evaluation."
    },
    {
      id: 28,
      question: "The nurse observes a newborn with central cyanosis that worsens with crying and improves with quiet rest. This pattern suggests:",
      options: [
        "Normal newborn behavior",
        "Respiratory disorder",
        "Cyanotic heart disease",
        "Polycythemia"
      ],
      correct: 2,
      rationale: "Cyanosis worsening with crying (increased oxygen demand) and improving at rest is characteristic of cyanotic congenital heart disease."
    },
    {
      id: 29,
      question: "A newborn of a mother with diabetes has a heel stick glucose of 28 mg/dL at 1 hour of age. After feeding, the level is 32 mg/dL. The nurse should:",
      options: [
        "Continue routine feeding schedule",
        "Administer IV dextrose",
        "Recheck in 4 hours",
        "Give formula supplement"
      ],
      correct: 1,
      rationale: "IDM with persistent hypoglycemia <40 mg/dL despite feeding requires IV dextrose to prevent neurological sequelae."
    },
    {
      id: 30,
      question: "The nurse performs a gestational age assessment on a newborn with abundant lanugo, minimal plantar creases, and flat areolas. These findings indicate:",
      options: [
        "Post-term infant",
        "Term infant",
        "Preterm infant",
        "Growth restricted infant"
      ],
      correct: 2,
      rationale: "Abundant lanugo, minimal plantar creases, and underdeveloped breast tissue are physical markers of prematurity (<37 weeks)."
    },
    {
      id: 31,
      question: "A newborn has persistent tachycardia of 180 bpm while sleeping. The nurse should first:",
      options: [
        "Check blood pressure",
        "Assess for hypoglycemia",
        "Check temperature",
        "Obtain ECG"
      ],
      correct: 2,
      rationale: "Persistent tachycardia during sleep (normal 80-100) often indicates hyperthermia or cold stress. Temperature should be assessed first."
    },
    {
      id: 32,
      question: "The nurse notes acrocyanosis in a 24-hour-old newborn with otherwise normal findings. The appropriate response is:",
      options: [
        "Apply oxygen immediately",
        "Notify the provider",
        "Document as normal finding",
        "Check pulse oximetry"
      ],
      correct: 2,
      rationale: "Acrocyanosis (blue hands/feet) is normal for 24-48 hours due to immature peripheral circulation. Central pink color is key."
    },
    {
      id: 33,
      question: "A newborn has lost 11% of birth weight by day 4. Which assessment is most important?",
      options: [
        "Feeding frequency and effectiveness",
        "Environmental temperature",
        "Maternal medication history",
        "Fontanel status"
      ],
      correct: 0,
      rationale: "Weight loss >10% by day 4 indicates inadequate intake. Assessing feeding frequency, duration, and effectiveness is crucial for intervention."
    },
    {
      id: 34,
      question: "The nurse observes a 2-day-old with jitteriness that stops when the extremity is held. This finding suggests:",
      options: [
        "Seizure activity",
        "Hypocalcemia",
        "Drug withdrawal",
        "Normal newborn behavior"
      ],
      correct: 3,
      rationale: "Jitteriness that stops with gentle restraint is normal newborn behavior. Seizures don't stop with holding; withdrawal causes persistent irritability."
    },
    {
      id: 35,
      question: "During assessment, the nurse cannot palpate the posterior fontanel. This finding:",
      options: [
        "Requires immediate CT scan",
        "Indicates increased intracranial pressure",
        "Is normal as it may be very small",
        "Suggests premature fusion"
      ],
      correct: 2,
      rationale: "Posterior fontanel can be very small (<1 cm) or closed at birth in some normal newborns. Absence alone doesn't indicate pathology."
    },

    // Infant Feeding (Questions 36-50)
    {
      id: 36,
      question: "A mother states her 5-day-old infant wants to nurse 'constantly' in the evening, feeding every 30-45 minutes. The nurse explains this is:",
      options: [
        "Sign of inadequate milk supply",
        "Abnormal feeding pattern",
        "Normal cluster feeding",
        "Indication for formula supplementation"
      ],
      correct: 2,
      rationale: "Cluster feeding, especially in evenings, is normal infant behavior that helps increase milk supply. It doesn't indicate inadequate nutrition."
    },
    {
      id: 37,
      question: "The nurse observes a mother positioning her large breast for feeding. Which technique would best help the infant latch?",
      options: [
        "Football hold with breast support",
        "Cradle hold without support",
        "Side-lying with pillows",
        "Cross-cradle with C-hold"
      ],
      correct: 3,
      rationale: "Cross-cradle position with C-hold breast support gives best control for latch with large breasts, allowing mother to shape breast and guide baby."
    },
    {
      id: 38,
      question: "A 3-week-old formula-fed infant has hard, pellet-like stools every 3 days. The nurse should recommend:",
      options: [
        "Switching to soy formula",
        "Adding extra water to formula",
        "Giving 1-2 oz water between feeds",
        "Continuing current feeding plan"
      ],
      correct: 2,
      rationale: "Formula-fed infants may need small amounts of water between feeds for constipation. Never dilute formula as this alters nutrition."
    },
    {
      id: 39,
      question: "A mother who plans to return to work at 8 weeks asks when to introduce bottles. The nurse advises:",
      options: [
        "Wait until 6 weeks to avoid confusion",
        "Start at 3-4 weeks with one bottle daily",
        "Begin immediately for practice",
        "Only introduce the week before work"
      ],
      correct: 1,
      rationale: "Introducing one bottle daily at 3-4 weeks allows baby to learn bottle feeding without interfering with breastfeeding establishment."
    },
    {
      id: 40,
      question: "The nurse notes a breastfeeding infant has orange, seedy stools 8 times daily. The mother is concerned about diarrhea. The nurse explains:",
      options: [
        "This indicates lactose intolerance",
        "Formula supplementation is needed",
        "This is normal breastfed stool",
        "Maternal diet changes are required"
      ],
      correct: 2,
      rationale: "Frequent yellow-orange, seedy stools are normal for breastfed infants. True diarrhea would be watery with increased frequency."
    },
    {
      id: 41,
      question: "A mother reports severe nipple pain throughout entire feedings despite position changes. The priority assessment is:",
      options: [
        "Infant's oral cavity for thrush",
        "Mother's bra fit",
        "Feeding frequency",
        "Milk supply"
      ],
      correct: 0,
      rationale: "Persistent severe pain despite good positioning often indicates thrush infection requiring treatment of both mother and baby."
    },
    {
      id: 42,
      question: "An exclusively breastfed 2-month-old has gained only 3 ounces in the past month. The nurse should first:",
      options: [
        "Recommend immediate formula supplementation",
        "Observe a complete feeding session",
        "Check maternal medications",
        "Order infant metabolic screening"
      ],
      correct: 1,
      rationale: "Poor weight gain requires assessment of feeding effectiveness. Observing latch, suck pattern, and milk transfer guides appropriate intervention."
    },
    {
      id: 43,
      question: "A mother asks about using donor breast milk from her sister. The nurse's best response includes:",
      options: [
        "This is never recommended due to disease risk",
        "Informal milk sharing is completely safe between relatives",
        "Discuss risks and recommend screening if pursued",
        "Only use milk from certified milk banks"
      ],
      correct: 2,
      rationale: "While milk banks are safest, if families choose informal sharing, education about risks and screening recommendations provides harm reduction."
    },
    {
      id: 44,
      question: "A mother with inverted nipples is struggling to breastfeed. The most helpful intervention is:",
      options: [
        "Immediate use of nipple shields",
        "Exclusive pumping and bottle feeding",
        "Breast shells worn between feedings",
        "Manual nipple eversion techniques before latching"
      ],
      correct: 3,
      rationale: "Manual techniques (rolling, pulling, cold) to evert nipples before feeding are most helpful. Shields should be last resort."
    },
    {
      id: 45,
      question: "A 6-day-old infant has transcutaneous bilirubin of 15 mg/dL. The mother asks if she should stop breastfeeding. The nurse responds:",
      options: [
        "Yes, stop for 24 hours then resume",
        "No, frequent breastfeeding helps eliminate bilirubin",
        "Supplement with formula after each breastfeeding",
        "Pump and discard milk during phototherapy"
      ],
      correct: 1,
      rationale: "Frequent breastfeeding promotes stooling which eliminates bilirubin. Interruption is rarely indicated and can harm breastfeeding success."
    },
    {
      id: 46,
      question: "The nurse teaches about introducing solid foods to a breastfed infant. Which statement indicates understanding?",
      options: [
        "Start rice cereal at 4 months to help sleep longer",
        "Wait until 6 months when baby shows readiness signs",
        "Begin at 3 months to prevent iron deficiency",
        "Introduce foods at 5 months regardless of interest"
      ],
      correct: 1,
      rationale: "AAP recommends exclusive breastfeeding for 6 months, then introducing solids when baby shows developmental readiness signs."
    },
    {
      id: 47,
      question: "A mother's milk supply has decreased after starting combined oral contraceptives. The nurse should:",
      options: [
        "Reassure that this is temporary",
        "Recommend pumping more frequently",
        "Suggest switching to progestin-only method",
        "Advise immediate weaning"
      ],
      correct: 2,
      rationale: "Combined contraceptives can decrease milk supply. Progestin-only methods are preferred for breastfeeding mothers."
    },
    {
      id: 48,
      question: "A mother exclusively pumping reports decreasing output despite pumping every 3 hours. The best advice includes:",
      options: [
        "Accept that exclusive pumping isn't sustainable",
        "Add power pumping sessions and check flange fit",
        "Supplement with formula for all feeds",
        "Reduce pumping to allow breasts to fill more"
      ],
      correct: 1,
      rationale: "Power pumping (cluster pumping) mimics cluster feeding to boost supply. Proper flange fit is crucial for effective pumping."
    },
    {
      id: 49,
      question: "The nurse observes white patches in a 2-week-old's mouth that don't wipe away. The mother reports recent nipple pain. Treatment should include:",
      options: [
        "Nystatin for infant only",
        "Fluconazole for mother only",
        "Antifungal treatment for both",
        "Improved hygiene only"
      ],
      correct: 2,
      rationale: "Thrush requires simultaneous treatment of mother and baby to prevent reinfection. Both need appropriate antifungal therapy."
    },
    {
      id: 50,
      question: "A formula-feeding mother asks about the best water to use. In an area with fluoridated water, the nurse recommends:",
      options: [
        "Only use bottled water",
        "Boil tap water for 10 minutes",
        "Use tap water without boiling after 2 months",
        "Always use distilled water"
      ],
      correct: 2,
      rationale: "In areas with safe, fluoridated water, tap water can be used without boiling after 2 months. Boiling is only needed for infants <2 months or if water safety is questionable."
    },

    // Psychosocial Adaptation & Family Care (Questions 51-65)
    {
      id: 51,
      question: "On postpartum day 3, a mother states 'I cry for no reason and feel overwhelmed.' Her Edinburgh score is 8. The nurse should:",
      options: [
        "Screen for postpartum psychosis",
        "Initiate antidepressant therapy",
        "Provide reassurance about baby blues",
        "Refer for immediate psychiatric evaluation"
      ],
      correct: 2,
      rationale: "Day 3 tearfulness with Edinburgh score <10 indicates baby blues. Reassurance and support are appropriate; this typically resolves by 2 weeks."
    },
    {
      id: 52,
      question: "A father states he feels 'useless' because he can't breastfeed the baby. The nurse's best response is:",
      options: [
        "You can give bottles of expressed milk",
        "Feeding isn't the only way to bond with baby",
        "Your partner needs to do all the feeding",
        "Let's explore specific ways you can be involved"
      ],
      correct: 3,
      rationale: "Exploring specific involvement opportunities (diapering, bathing, skin-to-skin, comforting) helps fathers identify their unique role."
    },
    {
      id: 53,
      question: "A teen mother's parent wants to make all decisions about infant care. The nurse should:",
      options: [
        "Support the grandparent as more experienced",
        "Exclude grandparent from teaching sessions",
        "Facilitate discussion about role boundaries",
        "Tell grandparent to let teen learn independently"
      ],
      correct: 2,
      rationale: "Facilitating discussion helps establish healthy boundaries while maintaining support. Teen mothers need autonomy with appropriate support."
    },
    {
      id: 54,
      question: "A mother in the taking-hold phase repeatedly asks the same questions about infant care. This behavior indicates:",
      options: [
        "Learning disability",
        "Postpartum depression",
        "Normal anxiety and need for reinforcement",
        "Inability to care for infant"
      ],
      correct: 2,
      rationale: "Repetitive questions during taking-hold phase reflect anxiety about new responsibilities. Patience and repeated teaching build confidence."
    },
    {
      id: 55,
      question: "During home visit, the nurse notes a mother holding her 2-week-old at arm's length, avoiding eye contact. Priority action is:",
      options: [
        "Remove infant from home immediately",
        "Model nurturing behaviors and assess further",
        "Document observations only",
        "Refer to child protective services"
      ],
      correct: 1,
      rationale: "Attachment difficulties require intervention but not immediate removal. Modeling behaviors and further assessment guide appropriate support."
    },
    {
      id: 56,
      question: "A mother states 'I love my baby but sometimes I think about leaving and never coming back.' This statement requires:",
      options: [
        "Reassurance that all mothers have these thoughts",
        "Immediate safety assessment and mental health referral",
        "Suggestion to take a short break",
        "Increased family visiting hours"
      ],
      correct: 1,
      rationale: "Thoughts of abandonment indicate serious mood disorder requiring immediate assessment for safety and mental health intervention."
    },
    {
      id: 57,
      question: "A 5-year-old sibling has started bedwetting since the baby arrived. The parents should be advised to:",
      options: [
        "Punish the behavior to stop it quickly",
        "Ignore it completely",
        "Provide special one-on-one time with the child",
        "Have the child checked for diabetes"
      ],
      correct: 2,
      rationale: "Regression is normal with new siblings. Individual attention and maintaining routines help adjustment without punishment or shame."
    },
    {
      id: 58,
      question: "A mother scores 15 on Edinburgh scale at 2 weeks postpartum with no response to question 10. The nurse should:",
      options: [
        "Rescreen in 2 weeks",
        "Provide support group information only",
        "Refer for mental health evaluation within the week",
        "Hospitalize immediately"
      ],
      correct: 2,
      rationale: "Score ≥13 indicates probable depression requiring prompt mental health referral. Absence of suicidal ideation allows outpatient management."
    },
    {
      id: 59,
      question: "A same-sex couple asks about both partners bonding with the baby. The nurse's best approach is:",
      options: [
        "Only the biological parent can truly bond",
        "Take turns with all care activities",
        "Both partners can develop equal attachment through consistent care",
        "The non-biological parent should wait to avoid confusion"
      ],
      correct: 2,
      rationale: "Attachment develops through consistent, responsive caregiving regardless of biological relationship. Both parents should be equally involved."
    },
    {
      id: 60,
      question: "A mother constantly compares her baby to others and expresses disappointment about appearance. This suggests:",
      options: [
        "Normal adjustment to reality vs expectations",
        "Risk for impaired attachment",
        "Cultural differences in expression",
        "Need for vision screening"
      ],
      correct: 1,
      rationale: "Persistent disappointment and negative comparisons indicate attachment risk requiring intervention to promote acceptance and bonding."
    },
    {
      id: 61,
      question: "During the letting-go phase, a mother expresses grief about her pre-pregnancy life. The nurse recognizes this as:",
      options: [
        "Postpartum depression",
        "Abnormal adjustment",
        "Normal role transition",
        "Rejection of motherhood"
      ],
      correct: 2,
      rationale: "Grieving pre-maternal identity is normal in letting-go phase as women integrate their new role. Support and validation are helpful."
    },
    {
      id: 62,
      question: "A mother asks when she'll 'feel like a real mother.' The nurse's best response is:",
      options: [
        "Most women feel it immediately after birth",
        "If you don't feel it by now, you may need help",
        "Maternal identity develops over time through experience",
        "Real mothers don't question their feelings"
      ],
      correct: 2,
      rationale: "Maternal role attainment is a process that develops over time through interaction and experience, not an instant transformation."
    },
    {
      id: 63,
      question: "A couple disagrees about circumcision for their son. The nurse should:",
      options: [
        "Advocate for the medical benefits",
        "Support the mother's preference",
        "Facilitate discussion of each person's views",
        "Refer to the pediatrician for decision"
      ],
      correct: 2,
      rationale: "Facilitating open discussion helps couples work through decisions together. The nurse provides information but supports their process."
    },
    {
      id: 64,
      question: "A single mother with limited support expresses feeling overwhelmed. Priority intervention is:",
      options: [
        "Suggest she move in with family",
        "Connect with community resources and support groups",
        "Recommend adoption consideration",
        "Increase hospital stay length"
      ],
      correct: 1,
      rationale: "Connecting single mothers with community resources and peer support provides sustainable help while maintaining autonomy."
    },
    {
      id: 65,
      question: "Grandparents insist on outdated practices like belly binding. The nurse should:",
      options: [
        "Tell them these practices are harmful",
        "Ignore their input entirely",
        "Explore cultural significance and safety concerns",
        "Report them for endangerment"
      ],
      correct: 2,
      rationale: "Understanding cultural practices while discussing safety allows respectful education and compromise when possible."
    },

    // Complications & Emergency Care (Questions 66-80)
    {
      id: 66,
      question: "A postpartum client suddenly develops severe perineal pain and a visible bulging mass. The nurse suspects:",
      options: [
        "Uterine prolapse",
        "Vulvar hematoma",
        "Hemorrhoid exacerbation",
        "Perineal edema"
      ],
      correct: 1,
      rationale: "Sudden severe pain with visible bulging mass indicates expanding hematoma requiring immediate evaluation to prevent shock from concealed bleeding."
    },
    {
      id: 67,
      question: "A client 4 days post-cesarean develops unilateral calf pain, warmth, and 2+ pitting edema. The nurse should:",
      options: [
        "Encourage ambulation to improve circulation",
        "Massage the affected area",
        "Apply compression stockings",
        "Maintain bed rest and notify provider"
      ],
      correct: 3,
      rationale: "These signs indicate DVT. Bed rest prevents embolization while awaiting diagnostic studies. Massage or ambulation could dislodge clot."
    },
    {
      id: 68,
      question: "A breastfeeding mother develops temperature 103°F, chills, and a firm, red breast quadrant. Initial treatment includes:",
      options: [
        "Stop breastfeeding and pump/discard milk",
        "Ice packs and binding",
        "Antibiotics and continued breastfeeding",
        "Hospitalization for IV antibiotics"
      ],
      correct: 2,
      rationale: "Mastitis treatment includes antibiotics and continued breastfeeding/pumping to empty the breast. Milk remains safe for baby."
    },
    {
      id: 69,
      question: "The nurse suspects endometritis in a postpartum client. Which assessment finding best supports this diagnosis?",
      options: [
        "Temperature 100.5°F",
        "Fundal tenderness with foul lochia",
        "Moderate lochia rubra",
        "WBC 25,000/mm³"
      ],
      correct: 1,
      rationale: "Fundal tenderness with foul-smelling lochia is pathognomonic for endometritis. Fever and elevated WBC can be normal postpartum."
    },
    {
      id: 70,
      question: "A postpartum client reports seeing 'sparkles' and develops a severe headache. Blood pressure is 164/102. Priority action is:",
      options: [
        "Administer acetaminophen",
        "Dim lights and start magnesium sulfate",
        "Encourage ambulation",
        "Check temperature"
      ],
      correct: 1,
      rationale: "Visual disturbances with severe headache and hypertension indicate severe preeclampsia. Seizure precautions and magnesium are priorities."
    },
    {
      id: 71,
      question: "During newborn examination, the nurse cannot insert a catheter through either nare. This finding indicates:",
      options: [
        "Normal nasal congestion",
        "Choanal atresia",
        "Deviated septum",
        "Upper respiratory infection"
      ],
      correct: 1,
      rationale: "Bilateral choanal atresia is a medical emergency as newborns are obligate nose breathers. Immediate airway management is required."
    },
    {
      id: 72,
      question: "A 2-day-old develops abdominal distention, bilious vomiting, and absence of stools. The nurse suspects:",
      options: [
        "Normal transition",
        "Overfeeding",
        "Intestinal obstruction",
        "Colic"
      ],
      correct: 2,
      rationale: "Bilious vomiting with distention and no stools indicates intestinal obstruction (possibly malrotation, volvulus) requiring emergency evaluation."
    },
    {
      id: 73,
      question: "A newborn with APGAR 8/9 develops grunting and cyanosis at 2 hours of age. Most likely cause is:",
      options: [
        "Congenital heart disease",
        "Transient tachypnea of newborn",
        "Meconium aspiration",
        "Respiratory distress syndrome"
      ],
      correct: 1,
      rationale: "TTN typically presents within 2 hours in term infants with good APGAR scores. It results from delayed lung fluid clearance."
    },
    {
      id: 74,
      question: "The nurse notes a pulsating mass at a newborn's anterior fontanel. This finding:",
      options: [
        "Is normal and reflects arterial pulsations",
        "Indicates increased intracranial pressure",
        "Suggests arteriovenous malformation",
        "Requires immediate neurosurgery"
      ],
      correct: 0,
      rationale: "Visible pulsations at the anterior fontanel are normal, reflecting arterial pulsations. Bulging or sunken fontanel would be concerning."
    },
    {
      id: 75,
      question: "A client with HELLP syndrome has platelet count 45,000/mm³. The nurse should prepare for:",
      options: [
        "Fresh frozen plasma transfusion",
        "Platelet transfusion",
        "Immediate delivery",
        "High-dose steroids only"
      ],
      correct: 2,
      rationale: "Severe thrombocytopenia with HELLP requires delivery as the definitive treatment. Platelets are given if <20,000 or bleeding occurs."
    },
    {
      id: 76,
      question: "A newborn develops projectile vomiting after each feeding starting at 3 weeks of age. Physical examination reveals:",
      options: [
        "Abdominal distention",
        "Olive-shaped mass in RUQ",
        "Hyperactive bowel sounds",
        "Rectal bleeding"
      ],
      correct: 1,
      rationale: "Projectile vomiting at 3 weeks with palpable olive-shaped mass indicates pyloric stenosis requiring surgical correction."
    },
    {
      id: 77,
      question: "A mother calls reporting her 5-day-old hasn't urinated in 18 hours. The nurse should advise:",
      options: [
        "This is normal; monitor for another 12 hours",
        "Increase feeding frequency",
        "Come to emergency department immediately",
        "Give 2 ounces of water"
      ],
      correct: 2,
      rationale: "No urine output for 18 hours in a newborn indicates severe dehydration requiring immediate evaluation and likely IV hydration."
    },
    {
      id: 78,
      question: "A postpartum client develops sudden dyspnea and says 'I'm going to die.' VS: BP 78/40, HR 140, RR 32. The nurse suspects:",
      options: [
        "Panic attack",
        "Amniotic fluid embolism",
        "Hemorrhagic shock",
        "Septic shock"
      ],
      correct: 1,
      rationale: "Sudden dyspnea with sense of doom and cardiovascular collapse suggests amniotic fluid embolism, requiring immediate life support."
    },
    {
      id: 79,
      question: "A newborn with excessive drooling requires multiple position changes during feeding. The nurse should assess for:",
      options: [
        "Cleft palate",
        "Tongue-tie",
        "Thrush infection",
        "Poor muscle tone"
      ],
      correct: 0,
      rationale: "Excessive drooling with position-dependent feeding difficulties suggests cleft palate, which may not be visible without careful examination."
    },
    {
      id: 80,
      question: "A postpartum client develops fever, tachycardia, and uterine tenderness 36 hours after prolonged rupture of membranes. Blood cultures should be drawn for:",
      options: [
        "Group B streptococcus only",
        "Aerobic bacteria only",
        "Aerobic and anaerobic bacteria",
        "Viral studies only"
      ],
      correct: 2,
      rationale: "Postpartum endometritis involves both aerobic and anaerobic bacteria. Blood cultures should include both for appropriate antibiotic selection."
    },

    // Fluid/Electrolytes & Medications (Questions 81-100)
    {
      id: 81,
      question: "A postpartum client receiving continuous oxytocin for 18 hours develops confusion and seizure. The nurse suspects:",
      options: [
        "Eclampsia",
        "Water intoxication",
        "Hypoglycemia",
        "Stroke"
      ],
      correct: 1,
      rationale: "Prolonged oxytocin administration can cause water intoxication due to its antidiuretic effect, leading to hyponatremia and seizures."
    },
    {
      id: 82,
      question: "Before administering methylergonovine for postpartum hemorrhage, the nurse must assess:",
      options: [
        "Deep tendon reflexes",
        "Blood glucose level",
        "Blood pressure",
        "Urinary output"
      ],
      correct: 2,
      rationale: "Methylergonovine causes vasoconstriction and is contraindicated in hypertension. Blood pressure must be checked before administration."
    },
    {
      id: 83,
      question: "A client's magnesium level is 8.5 mg/dL with absent reflexes. The antidote to administer is:",
      options: [
        "Calcium gluconate 1 gram IV",
        "Potassium chloride 40 mEq",
        "Sodium bicarbonate 50 mEq",
        "Dextrose 50% IV push"
      ],
      correct: 0,
      rationale: "Calcium gluconate is the antidote for magnesium toxicity. 1 gram IV over 3 minutes antagonizes magnesium's effects."
    },
    {
      id: 84,
      question: "A postpartum client has serum sodium of 125 mEq/L. Which IV fluid is contraindicated?",
      options: [
        "0.9% sodium chloride",
        "5% dextrose in water",
        "3% sodium chloride",
        "Lactated Ringer's"
      ],
      correct: 1,
      rationale: "D5W would worsen hyponatremia by providing free water without sodium. Isotonic or hypertonic saline is needed for correction."
    },
    {
      id: 85,
      question: "The nurse notes phlebitis at an IV site infusing antibiotics. The appropriate action is:",
      options: [
        "Slow the infusion rate",
        "Apply warm compress and continue",
        "Discontinue IV and restart in opposite extremity",
        "Elevate the extremity and monitor"
      ],
      correct: 2,
      rationale: "Phlebitis requires immediate IV discontinuation and restarting in another site to prevent thrombophlebitis and infection spread."
    },
    {
      id: 86,
      question: "A newborn receiving phototherapy has loose, green stools. The nurse recognizes this as:",
      options: [
        "Sign of infection requiring cultures",
        "Expected effect of treatment",
        "Indication to stop phototherapy",
        "Formula intolerance"
      ],
      correct: 1,
      rationale: "Phototherapy increases bilirubin excretion through stool, causing loose, green stools. This is expected and indicates treatment effectiveness."
    },
    {
      id: 87,
      question: "Which electrolyte imbalance is most likely in a postpartum client with prolonged vomiting?",
      options: [
        "Hypernatremia",
        "Hypokalemia",
        "Hypercalcemia",
        "Hypermagnesemia"
      ],
      correct: 1,
      rationale: "Prolonged vomiting causes loss of gastric acid (HCl) and potassium, leading to hypokalemia and metabolic alkalosis."
    },
    {
      id: 88,
      question: "A client receives carboprost for uterine atony. Which side effect requires prompt intervention?",
      options: [
        "Nausea",
        "Diarrhea",
        "Bronchospasm",
        "Fever"
      ],
      correct: 2,
      rationale: "Carboprost can cause severe bronchospasm, especially in asthmatics. This requires immediate intervention to maintain airway."
    },
    {
      id: 89,
      question: "The nurse prepares to administer RhoGAM to an Rh-negative mother. Which situation would contraindicate administration?",
      options: [
        "Mother is Rh-negative, baby is Rh-positive",
        "Mother has positive indirect Coombs test",
        "Mother is breastfeeding",
        "Mother had RhoGAM during pregnancy"
      ],
      correct: 1,
      rationale: "Positive indirect Coombs indicates existing Rh antibodies. RhoGAM won't help and is contraindicated once sensitization occurs."
    },
    {
      id: 90,
      question: "A postpartum client with preeclampsia has urine output of 20 mL/hour while receiving magnesium sulfate. The nurse should:",
      options: [
        "Increase the magnesium rate",
        "Stop magnesium and notify provider",
        "Administer furosemide",
        "Increase IV fluid rate"
      ],
      correct: 1,
      rationale: "Oliguria <30 mL/hour during magnesium therapy indicates toxicity risk as magnesium is renally excreted. Stop infusion immediately."
    },
    {
      id: 91,
      question: "Which finding indicates fluid volume deficit in a postpartum client?",
      options: [
        "Blood pressure 118/72",
        "Specific gravity 1.035",
        "Peripheral edema",
        "Weight gain of 2 pounds"
      ],
      correct: 1,
      rationale: "Specific gravity >1.030 indicates concentrated urine from dehydration. Normal is 1.010-1.025."
    },
    {
      id: 92,
      question: "A newborn's potassium level is 7.2 mEq/L. The nurse anticipates orders for:",
      options: [
        "Oral potassium supplement",
        "Calcium gluconate IV",
        "Magnesium sulfate",
        "Sodium bicarbonate"
      ],
      correct: 1,
      rationale: "Severe hyperkalemia requires calcium gluconate to stabilize cardiac membranes while other measures lower potassium levels."
    },
    {
      id: 93,
      question: "The nurse administers naloxone to a newborn with respiratory depression. The mother received morphine in labor. Expected response time is:",
      options: [
        "30-60 seconds",
        "2-3 minutes",
        "10-15 minutes",
        "20-30 minutes"
      ],
      correct: 1,
      rationale: "Naloxone works within 2-3 minutes to reverse opioid effects. Faster response suggests respiratory depression from other causes."
    },
    {
      id: 94,
      question: "A client's calcium level is 12.5 mg/dL postpartum. Priority nursing action is:",
      options: [
        "Encourage milk intake",
        "Administer vitamin D",
        "Increase IV fluid rate",
        "Give calcium supplement"
      ],
      correct: 2,
      rationale: "Hypercalcemia treatment includes IV fluids for dilution and renal excretion. Adding calcium would worsen the condition."
    },
    {
      id: 95,
      question: "Which medication interaction is most concerning for a breastfeeding mother taking warfarin?",
      options: [
        "Prenatal vitamins",
        "Ibuprofen",
        "Docusate sodium",
        "Ferrous sulfate"
      ],
      correct: 1,
      rationale: "NSAIDs like ibuprofen increase bleeding risk with warfarin and can affect infant through breast milk. Acetaminophen is safer."
    },
    {
      id: 96,
      question: "A postpartum client develops hives after receiving ampicillin. The nurse should:",
      options: [
        "Slow the infusion rate",
        "Stop infusion and maintain IV access",
        "Give diphenhydramine and continue",
        "Switch to oral antibiotics"
      ],
      correct: 1,
      rationale: "Hives indicate allergic reaction. Stop medication immediately but maintain IV access for emergency medications if needed."
    },
    {
      id: 97,
      question: "The nurse notes infiltration of an IV containing potassium chloride. Priority action is:",
      options: [
        "Apply warm compress",
        "Massage the area",
        "Stop infusion and remove IV",
        "Elevate the extremity"
      ],
      correct: 2,
      rationale: "Potassium is a vesicant that can cause tissue necrosis. Immediately stop infusion and remove catheter to prevent further damage."
    },
    {
      id: 98,
      question: "A newborn receiving gentamicin should be monitored for:",
      options: [
        "Hypoglycemia",
        "Jaundice",
        "Ototoxicity",
        "Bleeding"
      ],
      correct: 2,
      rationale: "Aminoglycosides like gentamicin cause ototoxicity and nephrotoxicity. Hearing screening and renal function monitoring are essential."
    },
    {
      id: 99,
      question: "Which laboratory value contraindicates hepatitis B vaccine administration to a newborn?",
      options: [
        "Platelet count 50,000/mm³",
        "Total bilirubin 12 mg/dL",
        "Hematocrit 45%",
        "None of these contraindicate vaccination"
      ],
      correct: 3,
      rationale: "Hepatitis B vaccine has no contraindications related to lab values. Even thrombocytopenia doesn't prevent IM injection with proper technique."
    },
    {
      id: 100,
      question: "A postpartum client receiving epidural morphine develops severe pruritus. The nurse should administer:",
      options: [
        "Diphenhydramine",
        "Naloxone low dose",
        "Methylprednisolone",
        "Epinephrine"
      ],
      correct: 1,
      rationale: "Low-dose naloxone (0.04-0.1 mg) relieves opioid-induced pruritus without reversing analgesia. Antihistamines are ineffective for this."
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
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
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                NCLEX Practice Quiz - Part 2
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
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
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
                          ? 'border-purple-500 bg-purple-50' 
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
                            ? 'bg-purple-500 text-white'
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
            <div className="mb-8 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">Rationale:</h3>
              <p className="text-purple-800">{current.rationale}</p>
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
                  : 'bg-purple-600 text-white hover:bg-purple-700'
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
                        ? 'bg-purple-600 text-white ring-2 ring-purple-400'
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

export default PostpartumQuizPart2;