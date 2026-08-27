import { kidtopiaHandbookEn, kidtopiaHandbookAm } from './kidtopiaHandbookData';

export type Language = 'en' | 'am';

// @ts-ignore
import staffFaeza from './assets/images/staff_faeza_1783247404498.jpg';
// @ts-ignore
import staffMekdes from './assets/images/staff_mekdes_1783247416818.jpg';
// @ts-ignore
import staffHayat from './assets/images/staff_hayat_1783247428289.jpg';
// @ts-ignore
import staffAlemitu from './assets/images/staff_alemitu_1783247442769.jpg';

export const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About Us",
      aboutCompany: "About the Company",
      aboutStaff: "Our Staff",
      programs: "Programs",
      virtualTour: "Virtual Tour",
      resources: "Parent Resources",
      testimonials: "Testimonials",
      contact: "Contact",
      bookTour: "Book a Tour",
      enrollNow: "Enroll Now",
      login: "Login",
      language: "Language",
      socialMedia: "Social Media",
      parentResources: "Parent Resources",
      backgroundColor: "#ffffff",
      textColor: "#44403c",
      activeColor: "#3a5b32"
    },
    announcement: {
      title: "",
      text: "",
      type: "info",
      buttonText: "",
      buttonLink: ""
    },
    hero: {
      badgeText: "Now Enrolling for 2026",
      title: "A Safe, Caring, and Inspiring Space for Your Child.",
      titleHighlight: "Safe, Caring",
      subheadline: "Welcome to Kidtopia International Daycare and Preschool — fully managed by our custom web-based daycare system, from online registration to QR Code parent checkout, with a dedicated parent dashboard.",
      enroll: "Enroll Your Child",
      bookTour: "Book a Tour",
      virtualTour: "Take a Virtual Tour",
      backgroundType: "image",
      heroImage: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2000&auto=format&fit=crop",
      heroVideo: "",
      textColor: "#ffffff",
      highlightSectionTitle: "What makes us special",
      highlights: [
        { title: "Safe Environment", desc: "Strict health and security protocols", image: "" },
        { title: "Qualified Staff", desc: "Trained and carefully selected nannies", image: "" },
        { title: "Kidtopia Web Portal", desc: "End-to-end software & Parent Dashboard", image: "" }
      ]
    },
    safety: {
      trustSafetyBadge: "Your Peace of Mind is Our Priority",
      title: "Your Child’s Safety is Our Priority",
      cards: [
        { title: "Health Screening", desc: "All children must provide immunization, TB, HIV, and hepatitis screening before enrollment.", image: "" },
        { title: "Staff Background Verification", desc: "Every Kidtopia staff member undergoes strict recruitment and identity verification.", image: "" },
        { title: "Secure Check-In and Check-Out", desc: "Our digital system ensures only authorized people can pick up your child.", image: "" },
        { title: "Clean Environment", desc: "Blankets and daycare materials are cleaned regularly using our internal laundry system.", image: "" }
      ]
    },
    programs: {
      title: "Our Learning Programs",
      cards: [
        { 
          name: "Toddler Program", 
          age: "1.5 – 3 Years", 
          desc: "Focus on communication, behavior development, and social interaction.", 
          btn: "Learn More", 
          image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop",
          moreInfo: "Our toddler program is designed to provide a safe and stimulating environment where young children can explore and learn. We focus on sensory play, language development, and building social skills through group activities. Our experienced caregivers provide personalized attention to help each child reach their milestones."
        },
        { 
          name: "Preschool Program", 
          age: "3 – 5 Years", 
          desc: "Early learning activities that prepare children for school success.", 
          btn: "Learn More", 
          image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop",
          moreInfo: "The preschool program at Kidtopia focuses on preparing children for the transition to primary school. We introduce basic literacy and numeracy concepts through fun, hands-on activities. Our curriculum also emphasizes emotional intelligence, problem-solving, and creative expression through art and music."
        }
      ]
    },
    whyChoose: {
      title: "Why Families Trust Kidtopia",
      image1: "",
      image2: "",
      features: [
        "Real-time parent communication with photo updates",
        "Comprehensive daily digital activity reports",
        "Healthy, sanitized and child-proof environments",
        "Small class sizes with certified loving caregivers",
        "Secure QR Code scanning and verified parent pickup system",
        "Transparent daycare operations & open communication",
        "Premium modern cognitive & motor skill development curriculum",
        "First aid & pediatric CPR certified staff members"
      ]
    },
    virtualTour: {
      title: "Explore Our Daycare",
      welcome: "Welcome to Kidtopia 360° Virtual Tour!",
      instructions: "Click and drag to explore",
      editButton: "Edit 360 Tour",
      watchFull: "Watch Full Virtual Tour",
      schedule: "Schedule a Physical Visit",
      collageImage1: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1000&auto=format&fit=crop",
      collageImage2: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop",
      ratingText: "★ 4.9",
      ratingSubtext: "Parent Rating in Addis Ababa",
      trustText: "100% Secure",
      trustSubtext: "Doctor Approved",
      media: [
        { url: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=1200&h=675&auto=format&fit=crop", type: "image", description: "Our beautiful and spacious play area." },
        { url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop", type: "image", description: "Happy children learning and playing in a safe space." },
        { url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop", type: "image", description: "Daycare active play and creative group learning." }
      ]
    },
    dailyExperience: {
      title: "A Day at Kidtopia",
      subtitle: "Tailored daily routines designed specifically for each developmental age group",
      schedules: [
        {
          id: "infants",
          name: "Infants",
          nameAm: "ሕፃናት",
          ageRange: "3 to 12 Months",
          ageRangeAm: "ከ 3 እስከ 12 ወራት",
          description: "Nurturing care, sensory play, personalized feeding, and peaceful sleep routines for our youngest learners.",
          descriptionAm: "ለቀዳሚ እድሜ ታዳጊዎቻችን ፍቅር የተሞላበት እንክብካቤ፣ የስሜት ህዋሳት እንቅስቃሴዎች፣ አመጋገብ እና ሰላማዊ የእረፍት ጊዜ።",
          timeline: [
            {
              time: "7:30 AM - 9:00 AM",
              activity: "Warm arrival, bottle feeding & gentle sensory play",
              activityAm: "ሞቅ ያለ አቀባበል፣ የምግብ/ወተት ሰዓት እና ቀላል የጨዋታ ጊዜ",
              image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop"
            },
            {
              time: "9:00 AM - 10:30 AM",
              activity: "Morning nap & soothing music relaxation",
              activityAm: "የጠዋት እንቅልፍ እና በሙዚቃ የተቀነባበረ የእረፍት ጊዜ",
              image: ""
            },
            {
              time: "10:30 AM - 11:30 AM",
              activity: "Tummy time, motor skill practice & outdoor buggy stroll",
              activityAm: "የሆድ ላይ ልምምድ፣ የእንቅስቃሴ ችሎታ ማሳደጊያ እና የውጪ አየር እረፍት",
              image: ""
            },
            {
              time: "11:30 AM - 12:30 PM",
              activity: "Midday feeding & organic puree tasting",
              activityAm: "የምሳ ሰዓት እና የተመጣጠነ ምግብ ቅመሳ",
              image: ""
            },
            {
              time: "12:30 PM - 2:30 PM",
              activity: "Restful afternoon sleep & quiet story nursery rhymes",
              activityAm: "የከሰአት እንቅልፍ እና የልጆች ታሪክ ማዳመጥ",
              image: ""
            },
            {
              time: "2:30 PM - 4:00 PM",
              activity: "Interactive puppet play & soft block exploration",
              activityAm: "የአሻንጉሊት ጨዋታዎች እና ለስላሳ እቃዎች አሰሳ",
              image: ""
            },
            {
              time: "4:00 PM - 5:30 PM",
              activity: "Evening wind-down, infant massage & parent pickup",
              activityAm: "የቀኑ ማጠቃለያ፣ የእጅና እግር ማሳጅ እና ለወላጆች ማስረከብ",
              image: ""
            }
          ]
        },
        {
          id: "toddlers",
          name: "Toddlers",
          nameAm: "ታዳጊዎች",
          ageRange: "1 to 2.5 Years",
          ageRangeAm: "ከ 1 እስከ 2.5 ዓመት",
          description: "Active discovery, early language building, outdoor play, and social interaction.",
          descriptionAm: "ንቁ አሰሳ፣ የቋንቋ እድገት ልምምድ፣ የውጪ ጨዋታ እና የማህበራዊ ግንኙነት ትምህርት።",
          timeline: [
            {
              time: "7:30 AM - 8:30 AM",
              activity: "Arrival, table toys & breakfast circle",
              activityAm: "አቀባበል፣ የጠረጴዛ ጨዋታዎች እና የቁርስ ክበብ",
              image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=800&auto=format&fit=crop"
            },
            {
              time: "8:30 AM - 9:30 AM",
              activity: "Morning greeting circle, song & fingerplay",
              activityAm: "የጠዋት ሰላምታ፣ መዝሙር እና የጣት ጨዋታዎች",
              image: ""
            },
            {
              time: "9:30 AM - 10:30 AM",
              activity: "Guided sensory exploration & finger painting",
              activityAm: "የስሜት ህዋሳት ጨዋታ እና በቀለም የመሳል ልምምድ",
              image: ""
            },
            {
              time: "10:30 AM - 11:30 AM",
              activity: "Outdoor playground time & gross motor obstacle course",
              activityAm: "የሜዳ ላይ ጨዋታዎች እና የአካል ብቃት እንቅስቃሴ",
              image: ""
            },
            {
              time: "11:30 AM - 12:30 PM",
              activity: "Nutritious hot lunch & handwashing routine",
              activityAm: "የምሳ ሰዓት እና የእጅ መታጠብ ልምድ ማሳደጊያ",
              image: ""
            },
            {
              time: "12:30 PM - 2:30 PM",
              activity: "Recharging nap time with soft lullabies",
              activityAm: "የእረፍት እና የእንቅስቃሴ ማደሻ ጊዜ",
              image: ""
            },
            {
              time: "2:30 PM - 3:30 PM",
              activity: "Afternoon healthy snack & storybook corner",
              activityAm: "የከሰአት መክሰስ እና የታሪክ መጽሐፍት ንባብ",
              image: ""
            },
            {
              time: "3:30 PM - 5:30 PM",
              activity: "Free play, music & movement circle, pickup",
              activityAm: "ነፃ ጨዋታ፣ የሙዚቃ እንቅስቃሴ እና ለወላጆች ማስረከብ",
              image: ""
            }
          ]
        },
        {
          id: "preschool",
          name: "Preschool",
          nameAm: "ቅድመ-ትምህርት ቤት",
          ageRange: "2.5 to 5 Years",
          ageRangeAm: "ከ 2.5 እስከ 5 ዓመት",
          description: "Structured STEM learning, phonics, creative art, character building, and school readiness.",
          descriptionAm: "የሳይንስና ቴክኖሎጂ ትምህርት፣ የቋንቋና ፊደላት ልምምድ፣ ስነ-ጥበብ እና ለትምህርት ቤት ዝግጁ የማድረግ ፕሮግራም።",
          timeline: [
            {
              time: "7:30 AM - 8:30 AM",
              activity: "Welcome, morning table challenges & breakfast",
              activityAm: "አቀባበል፣ የጠዋት አእምሮ ማነቃቂያ እና ቁርስ",
              image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop"
            },
            {
              time: "8:30 AM - 9:30 AM",
              activity: "Morning assembly, calendar, weather & bilingual phonics",
              activityAm: "የጠዋት ሰብሰባ፣ የቀን መቁጠሪያ፣ የአየር ሁኔታ እና ባለሁለት ቋንቋ ልምምድ",
              image: ""
            },
            {
              time: "9:30 AM - 10:45 AM",
              activity: "STEM learning centers, math puzzles & early writing",
              activityAm: "የSTEM ሳይንስ ማዕከላት፣ የሒሳብ እንቆቅልሾች እና የጽሑፍ ልምምድ",
              image: ""
            },
            {
              time: "10:45 AM - 11:45 AM",
              activity: "Outdoor sports, cooperative games & nature exploration",
              activityAm: "የስፖርት እንቅስቃሴዎች፣ የቡድን ጨዋታዎች እና ከተፈጥሮ ጋር መተዋወቅ",
              image: ""
            },
            {
              time: "11:45 AM - 12:45 PM",
              activity: "Family-style lunch & social etiquette lessons",
              activityAm: "የቤተሰብ አይነት የምሳ ሰዓት እና የማህበራዊ ስነ-ምግባር ትምህርት",
              image: ""
            },
            {
              time: "12:45 PM - 2:15 PM",
              activity: "Rest or quiet reading & mindfulness relaxation",
              activityAm: "የእረፍት ወይም የፀጥታ ንባብ እና የአእምሮ ማረጋጊያ",
              image: ""
            },
            {
              time: "2:15 PM - 3:30 PM",
              activity: "Creative art studio, drama play & language lab",
              activityAm: "የስነ-ጥበብ ስቱዲዮ፣ ድራማ እና የቋንቋ ቤተ-ሙከራ",
              image: ""
            },
            {
              time: "3:30 PM - 5:30 PM",
              activity: "Afternoon snack, reflection circle & departure",
              activityAm: "የከሰአት መክሰስ፣ የቀኑ ማጠቃለያ እና ጉዞ ወደ ቤት",
              image: ""
            }
          ]
        }
      ],
      timeline: [
        { time: "Morning", activity: "Welcome and check-in", image: "" },
        { time: "Mid-morning", activity: "Learning activities", image: "" },
        { time: "Lunch", activity: "Healthy meal time", image: "" },
        { time: "Afternoon", activity: "Nap and quiet time", image: "" },
        { time: "Late afternoon", activity: "Play and creative activities", image: "" },
        { time: "Evening", activity: "Secure parent pickup", image: "" }
      ]
    },
    faq: {
      title: "Frequently Asked Questions",
      items: [
        {
          question: "What are your health and immunization policies?",
          answer: "We require all children to provide immunization, TB, HIV, and Hepatitis screening before enrollment. Children who are actively sick must stay home to ensure a healthy environment for everyone."
        },
        {
          question: "How do you handle pick-up and drop-off security?",
          answer: "We use a secure digital check-in and check-out system. Only pre-authorized individuals with verified identification can pick up your child. Any changes must be communicated in advance."
        },
        {
          question: "How often are the toys and facilities cleaned?",
          answer: "Our daycare materials, blankets, and toys are regularly cleaned and sanitized daily. We use a professional internal laundry system and eco-friendly, non-toxic sanitizing products."
        },
        {
          question: "What is the child-to-teacher ratio?",
          answer: "We maintain small class sizes to ensure high-quality personalized attention. Our ratios strictly align with or exceed safety standards, with dedicated nannies and educators present at all times."
        }
      ]
    },
    testimonials: {
      title: "What Parents Say",
      list: [
        { 
          name: "Rediet Sisay", 
          text: "Leaving my child was difficult at first, but the teachers made us feel comfortable and supported from day one.", 
          rating: 5, 
          image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop",
          workInfo: "Enterpreneur"
        },
        { 
          name: "Selamawit Gebretensay", 
          text: "Kidtopia daycare helped my child interact with other children, its the place where my child learned to talk well, the staff make him loved and generally it is the best daycare i have seen in Addis Ababa. I would 100% recommened it.", 
          rating: 5, 
          image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&h=100&auto=format&fit=crop",
          workInfo: "Pharmacist"
        },
        { 
          name: "Samrawit Kassa", 
          text: "We are very grateful to be part of Kidtopia International Daycare and Preschool. It has truly been a wonderful experience for both me and my daughter. One of the things I appreciate most is the daily communication book. It keeps me fully informed about my child’s day—what she eats, when she sleeps, her activities, and even small details. This level of care and transparency gives me great peace of mind. The teachers are incredibly kind, protective, and truly loving toward the children.", 
          rating: 5, 
          image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=100&h=100&auto=format&fit=crop",
          workInfo: "Kidtopia Parent"
        },
        { 
          name: "Rihanna Yimam Hassen", 
          text: "Kidtopia has truly been the safest and most nurturing place for my baby. Since joining I’ve seen incredible progress in her communication skills, her play, and even her eating habits. Knowing she’s in such a caring and supportive environment gives me complete peace of mind.", 
          rating: 5, 
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&h=100&auto=format&fit=crop",
          workInfo: "Consultant at AFSIC"
        },
        { 
          name: "Dr. Serkalem Nurlegn", 
          text: "At kidtopia our child has found a loving nurturing environment. We live getting updates on his day. He is very happy and looks forward to being there. I definitely recommend kidtopia.", 
          rating: 5, 
          image: "https://images.unsplash.com/photo-1550525811-e5869dd03032?q=80&w=100&h=100&auto=format&fit=crop",
          workInfo: "Kidtopia Parent"
        },
        { 
          name: "Mehret Behailu", 
          text: "I have visited multiple daycares and preschools but I felt a sense of comfort and “hominess” with kidtopia.The dedicated staff is warm,caring and hardworking combined with fun and educational classroom structure, has truly made a positive impact on our family. I couldn’t imagine my daughter going anywhere else!", 
          rating: 5, 
          image: "https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=100&h=100&auto=format&fit=crop",
          workInfo: "Kidtopia Parent"
        }
      ]
    },
    cta: {
      title: "Give Your Child the Best Start",
      desc: "Join Kidtopia International Daycare and Preschool today.",
      enroll: "Start Enrollment",
      bookTour: "Book a Tour",
      virtualTour: "Take a Virtual Tour"
    },
    footer: {
      contact: "Contact Information",
      links: "Quick Links",
      resources: "Parent Resources",
      resourceLinks: [
        { label: "Parent Handbook", actionType: "handbook" },
        { label: "Nutrition Guide", actionType: "nutrition" },
        { label: "Ethiopian Childcare Directive", actionType: "intl_act" },
        { label: "Policies & Guidelines", actionType: "intl_guidelines" }
      ],
      social: {
        facebook: "https://facebook.com",
        instagram: "https://instagram.com",
        telegram: "https://t.me",
        tiktok: "https://tiktok.com",
        youtube: "https://youtube.com"
      },
      addresses: [
        { 
          locationName: "Kidtopia International Daycare and Preschool, Addis Ababa, Ethiopia", 
          googleMapsCoordinates: "9.0054,38.8475" 
        }
      ],
      phones: ["+251 911 000 000"],
      emails: ["info@kidtopia.com"],
      copyright: "© 2026 Kidtopia International Daycare and Preschool. All rights reserved.",
      developedBy: "Developed by Arho Technology",
      developerUrl: "https://arhotechnology.com"
    },
    resources: {
      title: "Parent Resources",
      desc: "Helpful materials and guides to support you and your child's journey with us.",
      items: [
        { title: "Parent Handbook", description: "Everything you need to know about our policies, daily schedules, and what to expect.", type: "PDF Document", image: "", actionType: "handbook", link: "" },
        { title: "Nutrition Guide", description: "Learn about our healthy meal plans and get tips for nutritious eating at home.", type: "Guide", image: "", actionType: "nutrition", link: "" },
        { title: "Ethiopian Childcare Directive No. 1084/2025", description: "Official criteria, procedures, licensing, spatial, and hygienic regulations for childcare centers in Ethiopia.", type: "Regulatory Directive", image: "", actionType: "intl_act", link: "" },
        { title: "Consolidated Daycare Policies & Guidelines", description: "Review our comprehensive daycare terms and conditions, refund policies, illness rules, and parental codes of conduct.", type: "Parent Handbook Policy", image: "", actionType: "intl_guidelines", link: "" },
        { title: "Daycare Communication Software", description: "Access our daycare control and communication software for parents.", type: "Web Portal", image: "", actionType: "comms", link: "" },
        { title: "Development Milestones", description: "Track your child's age-appropriate developmental stages, cognitive and motor skills.", type: "Milestone Tracker", image: "", actionType: "milestones", link: "" }
      ],
      handbookChapters: kidtopiaHandbookEn,
      menuDays: [
        {
          day: "Monday",
          breakfast: "Organic Oat Porridge with fresh bananas and raw honey",
          lunch: "Lentil Stew (Misir Wot) with high-fiber Injera & steamed spinach",
          snack: "Assorted fruit skewers with low-fat organic yogurt",
          allergens: ["gluten", "dairy"]
        },
        {
          day: "Tuesday",
          breakfast: "Scrambled organic eggs with whole wheat toast",
          lunch: "Mild chicken breast cubes with mashed sweet potatoes and carrots",
          snack: "Pumpkin seed kernels and sliced local red apples",
          allergens: ["egg", "gluten"]
        },
        {
          day: "Wednesday",
          breakfast: "Barley Besso shake with dairy-free almond milk",
          lunch: "Mixed vegetable and chickpea Shiro stew with soft wheat Injera",
          snack: "Toasted whole grain crackers with avocado puree spread",
          allergens: ["gluten"]
        },
        {
          day: "Thursday",
          breakfast: "Whole wheat pancakes with natural organic maple syrup",
          lunch: "Steamed local white fish with brown rice and sauteed green beans",
          snack: "Dehydrated banana chips and organic orange slices",
          allergens: ["fish", "gluten"]
        },
        {
          day: "Friday",
          breakfast: "Mashed avocado toast with organic soft cheese crumble",
          lunch: "Traditional beef stew (Siga Alicha) with fluffy teff Injera",
          snack: "Baked sweet potato chips with honey cinnamon drizzle",
          allergens: ["dairy", "gluten"]
        }
      ],
      milestonesData: {
        infant: {
          title: "Infants (3 - 12 Months)",
          items: [
            { id: "i1", text: "Rolls over from tummy to back and back to tummy" },
            { id: "i2", text: "Responds to own name and smiles at familiar faces" },
            { id: "i3", text: "Reaches for and grasps toys with purpose" },
            { id: "i4", text: "Babbles consonant sounds (e.g., 'ba-ba', 'da-da')" },
            { id: "i5", text: "Sits without support and explores surroundings" },
            { id: "i6", text: "Tracks moving objects smoothly with eyes" }
          ]
        },
        toddler: {
          title: "Toddlers (12 - 24 Months)",
          items: [
            { id: "t1", text: "Walks independently and starts to run" },
            { id: "t2", text: "Says several single words and simple 2-word phrases" },
            { id: "t3", text: "Points to objects or pictures when they are named" },
            { id: "t4", text: "Begins to sort shapes and colors" },
            { id: "t5", text: "Plays simple pretend games (e.g., feeding a doll)" },
            { id: "t6", text: "Follows simple one-step verbal instructions" }
          ]
        },
        preschool: {
          title: "Preschoolers (2 - 4 Years)",
          items: [
            { id: "p1", text: "Climbs well and runs easily" },
            { id: "p2", text: "Speaks in sentences of 3-4 words" },
            { id: "p3", text: "Can work toys with buttons, levers, and moving parts" },
            { id: "p4", text: "Copies a circle with crayon or pencil" },
            { id: "p5", text: "Shows affection for friends and expresses wide range of emotions" },
            { id: "p6", text: "Takes turns in games and understands 'mine' and 'theirs'" }
          ]
        },
        kinder: {
          title: "Kindergarten (4 - 5 Years)",
          items: [
            { id: "k1", text: "Speaks very clearly and tells simple stories" },
            { id: "k2", text: "Can count 10 or more objects" },
            { id: "k3", text: "Draws a person with at least 6 body parts" },
            { id: "k4", text: "Writes some letters or numbers, and copies triangle" },
            { id: "k5", text: "Stands on one foot for 10 seconds or longer" },
            { id: "k6", text: "Understands the difference between real and make-believe" }
          ]
        }
      },
      intlActTitle: "Ethiopian Childcare Directive No. 1084/2025 Criteria",
      intlActBody: `OVERVIEW OF ETHIOPIAN CHILD-CARE CENTERS DIRECTIVE NO. 1084/2025

Kidtopia International Daycare fully complies with the safety, structural, educational, and hygienic requirements set by the Ethiopian Ministry of Justice (under Directive No. 1084/2025). Below are the core regulatory criteria and standard operational procedures enforced at our center:

1. LICENSING & REGULATORY STANDARDS (Articles 4 & 7)
• Licensing Authority: Any childcare center in Ethiopia must obtain official registration and undergo annual inspections from the competent municipal/regional regulatory bureaus.
• Operating License: Kidtopia holds a valid operating certificate, meeting all technical, environmental, and spatial safety benchmarks.

2. PHYSICAL SPACE & INFRASTRUCTURE (Articles 10 & 11)
• Space Requirements: Childcare centers are required to provide a minimum of 2.5 square meters of clean indoor space per child.
• Classroom Safety: Classrooms must have adequate natural ventilation, bright light, kid-friendly furniture with rounded edges, and no exposure to sharp materials or hazardous substances.
• Outdoor Play Space: Fenced, safe playground area is mandatory to ensure children have active daily recreation without exposure to external traffic.

3. CAREGIVER STAFF-TO-CHILD RATIOS (Article 14)
To ensure high-quality individual attention, caregiver ratios are legally mandated by age groups:
• Infants (under 1 year): 1 Caregiver per 3 Infants (1:3 Ratio)
• Toddlers (1 to 2 years): 1 Caregiver per 5 Toddlers (1:5 Ratio)
• Preschoolers (3 to 5 years): 1 Caregiver per 8 Children (1:8 Ratio)
Kidtopia strictly adheres to or exceeds these ratios to maintain safety.

4. STAFF CREDENTIALS & HEALTH (Articles 15 & 16)
• Certification: Lead educators and care staff must hold validated certifications in Early Childhood Education (ECE) or equivalent training.
• Background Checks: All employees undergo absolute criminal background screening to ensure student protection.
• Medical Clearance: Staff must obtain physical health clearances, showing they are free of contagious, mental, or physical conditions that could impede children’s well-being.

5. HEALTH, HYGIENE & MEDICAL CHECKS (Article 18)
• Children’s Health Cards: All children must submit a certified health record, including an up-to-date vaccination chart (Measles, Polio, BCG, DPT) and infectious disease clearance.
• Daily Health Inspection: Upon daily arrival, children are screened for visible symptoms of illness.
• Cleaning Routines: Routine disinfection of toys, sanitizing of toilets, and commercial washing of sleeping linens are performed daily.

6. SAFETY, EMERGENCY & UTILITY SECURITY
• Evacuation Plans: Emergency fire drills are conducted twice a year.
• Controlled Ingress/Egress: Access gates are securely locked. Only pre-authorized administrative staff and verified guardians with secure QR Code scanning from parents' phones can enter the premises.
• First Aid: Fully stocked medical boxes are present in every classroom, and staff are trained in child CPR.`,
      intlGuidelinesTitle: "Consolidated Daycare Policies & Terms",
      intlGuidelinesBody: `KIDTOPIA INTERNATIONAL DAYCARE - CONSOLIDATED OPERATIONAL POLICIES

Welcome to the Kidtopia parent community! By enrolling your child, you enter into a partnership with us. Below are our consolidated operational terms, payment systems, safety protocols, and behavioral rules:

1. ADMISSION, HOURS & LATE PICK-UP
• Operational Hours: The center is open Monday through Friday from 7:30 AM to 6:00 PM.
• Prompt Arrival: We recommend arriving before 8:30 AM so children can participate in our morning circle activities.
• Late Pick-Up Fee: Children must be picked up by 6:00 PM. A late pick-up fee of 200 ETB is charged for every 15 minutes of delay, payable directly to the administration.

2. FINANCIAL TERMS & PAYMENT SYSTEMS
• Monthly Tuition: Tuition is paid monthly in advance. Invoice statements are sent on the 25th of the preceding month.
• Payment Deadline: Tuition is due on or before the 1st of each month. A late payment penalty of 10% is applied on the 6th.
• Withdrawal Policy: To withdraw your child, you must submit a 30-day written advance notice. Failure to do so will result in the forfeiture of the security deposit.

3. HEALTH, ILLNESS & MEDICATION POLICY
• Sick Child Rule: To protect other students, children must stay home if they have:
  - Fever greater than 38°C
  - Vomiting or diarrhea within the last 24 hours
  - Unexplained skin rashes or contagious infections
• Return to Care: Children may return to the center only when fever-free and symptom-free for at least 24 hours without the use of fever-reducing medication.
• Prescribed Medication: Center staff will administer prescribed medication only if accompanied by a signed doctor’s note and in its original pharmaceutical bottle.

4. PICK-UP SECURITY & QR CODES
• Authorized Pick-Up: Only guardians registered in the portal with authorized government photo IDs or registered secure QR Codes on their logged-in phones can pick up a child.
• Emergency Contact Update: If someone else needs to pick up your child, you must submit written notice in the portal or call the office at least 2 hours in advance. No child will be released to an unverified individual.

5. BEHAVIORAL CODE & DISCIPLINE
• Positive Guidance: We use positive reinforcement, redirection, and active conflict resolution. Physical punishment or shouting is strictly prohibited.
• Parent Conduct: Kidtopia enforces a zero-tolerance policy for verbal abuse, shouting, threats, or harassment of our teachers and administrative staff. Aggressive parental behavior will lead to the immediate expulsion of the child with zero refund.

6. MOBILE & DIGITAL DEVICE POLICY
• No Personal Screens: Personal tablets, cell phones, or electronic gaming devices are not allowed in classrooms.
• Focus: We promote cognitive development and social bonding through hands-on play, books, and interactive educational workshops.`,
      policiesAndRegulations: kidtopiaHandbookEn
    },
    leadCapture: {
      title: "Would you like to schedule a tour?",
      text: "Schedule a visit to Kidtopia and see our wonderful environment.",
      buttonText: "Book Tour",
      buttonLink: "/book-tour",
      laterText: "Later",
      type: "info",
      enabled: "true"
    },
    staff: {
      title: "Our Professional Staff",
      showLess: "Show Less",
      seeMore: "See More Staff",
      members: [
        { name: "Faeza Ebrahim", role: "School Nurse", desc: "Dedicated to the health and well-being of every child at Kidtopia.", image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=600&auto=format&fit=crop" },
        { name: "Miss Mekdes Alemu", role: "Lead Teacher", desc: "Expert in early childhood education and child development.", image: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop" },
        { name: "Miss Hayat Seid", role: "Caregiver", desc: "Providing a nurturing and supportive environment for our toddlers.", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop" },
        { name: "Miss Alemitu Abebe", role: "Preschool Educator", desc: "Preparing our older children for a smooth transition to school.", image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=600&auto=format&fit=crop" }
      ]
    },
    login: {
      title: "Welcome Back",
      subtitle: "Login to access your parent or staff portal",
      email: "Email Address",
      password: "Password",
      role: "Select Role",
      admin: "Administrator",
      parent: "Parent",
      staff: "Staff",
      submit: "Login",
      forgotPassword: "Forgot Password?",
      noAccount: "Don't have an account?",
      contactUs: "Contact Us"
    },
    reschedule: {
      backToHome: "Back to Home",
      title: "Reschedule Your Tour",
      notFound: "Booking not found.",
      alreadyProcessed: "This booking has already been processed and cannot be rescheduled here. Please contact us directly.",
      failedToLoad: "Failed to load booking details.",
      failedToUpdate: "Failed to update booking. Please try again.",
      success: "Tour Rescheduled Successfully!",
      successDesc: "Your new requested tour time is {date} at {time}. We will notify you once your booking is approved.",
      currentRequest: "Current Request:",
      date: "Date:",
      time: "Time:",
      selectNewDate: "Select New Date",
      selectNewTime: "Select New Time",
      noSlots: "No available slots in schedule.",
      pleaseSelectDate: "Please select a date first.",
      updating: "Updating...",
      updateButton: "Update Tour Time"
    },
    enrollmentPage: {
      title: "Enrollment Information & Required Documents",
      subtitle: "Welcome to the Kidtopia enrollment guide. Please prepare the following documents before proceeding to our online registration form.",
      processTitle: "Our 4-Step Enrollment Process",
      processSteps: [
        { step: "1", title: "Review Prerequisites", desc: "Ensure your child meets the age requirement (1.5 – 6 years) and you have all documents ready." },
        { step: "2", title: "Prepare Documents", desc: "Gather copies of identification, medical records, and specialized health screenings." },
        { step: "3", title: "Fill Registration Form", desc: "Click the proceed button at the bottom of the page to fill out the official application form." },
        { step: "4", title: "Confirmation & Intake", desc: "Our admissions office will verify documents, confirm placement, and schedule an intake session." }
      ],
      documentsTitle: "Required Enrollment Documents",
      documentsDesc: "All documents below must be uploaded or presented during registration to secure your child's spot.",
      documentsList: [
        { title: "Parent/Guardian National ID or Passport", desc: "A clear copy of a valid government-issued ID of the primary guardian (National ID card or passport)." },
        { title: "Child's Birth Certificate", desc: "An official birth certificate copy to verify age and parental relationship." },
        { title: "Vaccination & Immunization Record", desc: "Up-to-date immunization card showing yellow fever, polio, pentavalent, and other childhood vaccines." },
        { title: "Medical Conditions & History report", desc: "Detailed records or declarations of any pre-existing medical conditions, food allergies, or special care requirements." },
        { title: "Infant/Child Screening Results (Hepatitis, HIV, TB)", desc: "Recent official lab test results/medical clearance papers for Hepatitis B, HIV, and Tuberculosis (TB) screening." },
        { title: "Passport Photos", desc: "Recent passport-sized photographs of the child and parents/authorized pick-up persons." }
      ],
      proceedButton: "Proceed to Online Enrollment Form",
    },
    softwareShowcase: {
      badge: "Web-Based Daycare System",
      title: "From Registration to Kids' Checkout, Powered by Kidtopia's Web Portal",
      subtitle: "We believe transparency is the ultimate foundation of trust. That's why we built our custom web-based daycare system to keep you connected, secured, and informed every single second.",
      parentDashboardTitle: "Exclusive Parent Dashboard",
      parentDashboardDesc: "Parents get full access to a modern portal with real-time updates, child health logs, daily diet details, and direct communication with nannies.",
      uploadLabel: "Upload actual screenshot in Admin panel to replace this preview",
      uploadFormat: "Supports PNG, JPG or WebP. Replaces mock preview.",
      changeScreenshot: "Replace Custom Screenshot",
      useFallback: "Reset to Default Interface Preview",
      tabRegistration: "1. Online Registration",
      tabDashboard: "2. Parent Dashboard",
      tabQrcode: "3. QR Code Checkout",
      regTitle: "Streamlined Online Registration Portal",
      regDesc: "Say goodbye to physical paper stacks. Register your child, sign secure medical declarations, upload immunizations, and select learning tracks in 5 minutes.",
      dashTitle: "Secure Parent Control Panel & Live Feed",
      dashDesc: "Real-time feeding updates, nap timers, and activity checklists. View exclusive daily photo streams of your children participating in cognitive activities.",
      qrcodeTitle: "Secure QR Code Kids' Checkout & Analysis",
      qrcodeDesc: "Checkout is facilitated by secure QR Code scanning from parents' phones based on their login credentials. Parents can also view automated analyzed reports of their child's daily habits, activity logs, and routine highlights.",
      regBullet1: "Digital Immunization & Medical Submissions",
      regBullet2: "Daily Schedule & Custom Track Setup",
      regBullet3: "Instant Email Confirmation & Onboarding",
      dashBullet1: "Nap, Diet & Feeding Timer Indicators",
      dashBullet2: "Secure Daily Classroom Photo streams",
      dashBullet3: "Dynamic Health Status & Temperature logs",
      qrcodeBullet1: "Secure Dynamic QR Code generation for Parents",
      qrcodeBullet2: "Full Child Routine Status and analyzed report",
      qrcodeBullet3: "Instant Child Checkout SMS alert to parents",
      infoHighlight: "Every parent receives secure custom dashboard credentials to view their child's digital journal. Accessible via the \"Login\" button on the navigation bar."
    }
  },
  am: {
    nav: {
      home: "መነሻ",
      about: "ስለ እኛ",
      aboutCompany: "ስለ ድርጅቱ",
      aboutStaff: "ስለ ሰራተኞቻችን",
      programs: "ፕሮግራሞች",
      virtualTour: "ቪርቹዋል ጉብኝት",
      resources: "የወላጆች መርጃ",
      testimonials: "ምስክርነቶች",
      contact: "እውቂያ",
      bookTour: "ጉብኝት ያስይዙ",
      enrollNow: "አሁኑኑ ይመዝገቡ",
      login: "ግባ",
      language: "ቋንቋ",
      socialMedia: "ማህበራዊ ሚዲያ",
      parentResources: "የወላጆች መርጃ",
      backgroundColor: "#ffffff",
      textColor: "#44403c",
      activeColor: "#3a5b32"
    },
    announcement: {
      title: "",
      text: "",
      type: "info",
      buttonText: "",
      buttonLink: ""
    },
    hero: {
      badgeText: "ለ2026 ምዝገባ ላይ ነን",
      title: "ልጅዎ የሚያድግበት ደህንነቱ የተጠበቀ፣ አሳቢ እና አነቃቂ ቦታ",
      titleHighlight: "ደህንነቱ የተጠበቀ፣ አሳቢ",
      subheadline: "እንኳን ወደ ኪድቶፒያ ዓለም አቀፍ የህፃናት ማቆያ እና ቅድመ ትምህርት ቤት በደህና መጡ። ከበይነመረብ ምዝገባ እስከ QR ኮድ መውጫ ባለው ዘመናዊ የኪድቶፒያ የዌብ ሶፍትዌር እና ለእያንዳንዱ ወላጅ በተዘጋጀ የቀጥታ የክትትል ዳሽቦርድ ሙሉ በሙሉ የተደራጀ ምቹ የህፃናት ማቆያ።",
      enroll: "ልጅዎን ያስመዝግቡ",
      bookTour: "ጉብኝት ያስይዙ",
      virtualTour: "ቪርቹዋል ጉብኝት ያድርጉ",
      backgroundType: "image",
      heroImage: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2000&auto=format&fit=crop",
      heroVideo: "",
      textColor: "#ffffff",
      highlightSectionTitle: "ምን የተለየ ያደርገናል",
      highlights: [
        { title: "ደህንነቱ የተጠበቀ አካባቢ", desc: "ጥብቅ የጤና እና የደህንነት ፕሮቶኮሎች", image: "" },
        { title: "ብቁ ሰራተኞች", desc: "የሰለጠኑ እና በጥንቃቄ የተመረጡ ሞግዚቶች", image: "" },
        { title: "የኪድቶፒያ ሶፍትዌር", desc: "ከምዝገባ እስከ QR መውጫ እና የወላጅ ዳሽቦርድ", image: "" }
      ]
    },
    safety: {
      trustSafetyBadge: "የልጅዎ ሰላም ቅድሚያ የምንሰጠው ጉዳይ ነው",
      title: "የልጅዎ ደህንነት ቅድሚያ የምንሰጠው ጉዳይ ነው",
      cards: [
        { title: "የጤና ምርመራ", desc: "ሁሉም ህፃናት ከመመዝገባቸው በፊት የክትባት፣ የቲቢ፣ የኤችአይቪ እና የሄፓታይተስ ምርመራ ማቅረብ አለባቸው።", image: "" },
        { title: "የሰራተኞች ዳራ ማረጋገጫ", desc: "እያንዳንዱ የኪድቶፒያ ሰራተኛ ጥብቅ የቅጥር እና የማንነት ማረጋገጫ ይደረግለታል።", image: "" },
        { title: "ደህንነቱ የተጠበቀ መግቢያ እና መውጫ", desc: "የእኛ ዲጂታል ስርዓት የተፈቀደላቸው ሰዎች ብቻ ልጅዎን መውሰድ እንደሚችሉ ያረጋግጣል።", image: "" },
        { title: "ንጹህ አካባቢ", desc: "ብርድ ልብሶች እና የቀን እንክብካቤ ቁሳቁሶች በውስጣዊ የልብስ ማጠቢያ ስርዓታችን በየጊዜው ይጸዳሉ።", image: "" }
      ]
    },
    programs: {
      title: "የመማሪያ ፕሮግራሞቻችን",
      cards: [
        { 
          name: "የታዳጊዎች ፕሮግራም", 
          age: "1.5 – 3 ዓመታት", 
          desc: "በግንኙነት፣ በባህሪ እድገት እና በማህበራዊ መስተጋብር ላይ ያተኩራል።", 
          btn: "ተጨማሪ ይወቁ", 
          image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop",
          moreInfo: "የእኛ የታዳጊዎች ፕሮግራም ታዳጊ ህፃናት የሚማሩበት እና የሚጫወቱበት ደህንነቱ የተጠበቀ እና አነቃቂ አካባቢ ለመፍጠር የተነደፈ ነው። በቋንቋ እድገት እና በማህበራዊ ግንኙነት ላይ እናተኩራለን።"
        },
        { 
          name: "የቅድመ ትምህርት ቤት ፕሮግራም", 
          age: "3 – 5 ዓመታት", 
          desc: "ህፃናትን ለትምህርት ቤት ስኬት የሚያዘጋጁ የቀደመ ትምህርት እንቅስቃሴዎች።", 
          btn: "ተጨማሪ ይወቁ", 
          image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop",
          moreInfo: "የቅድመ ትምህርት ቤት ፕሮግራማችን ህፃናትን ለመደበኛ ትምህርት ቤት ዝግጁ እንዲሆኑ ያደርጋል። የመጻፍ እና የማንበብ መሰረታዊ ክህሎቶችን በሚያስደስት ሁኔታ እናስተምራለን።"
        }
      ]
    },
    whyChoose: {
      title: "ቤተሰቦች ለምን ኪድቶፒያን ያምናሉ",
      image1: "",
      image2: "",
      features: [
        "የእውነተኛ ጊዜ የወላጅ ግንኙነት ከፎቶ ዝመናዎች ጋር",
        "አጠቃላይ ዕለታዊ ዲጂታል የእንቅስቃሴ ሪፖርቶች",
        "ጤናማ፣ ንጹህ እና ደህንነቱ የተጠበቀ አካባቢ",
        "አነስተኛ የክፍል መጠኖች ከአፍቃሪ ተንከባካቢዎች ጋር",
        "ደህንነቱ የተጠበቀ የQR ኮድ የህፃናት መውሰጃ ስርዓት",
        "ግልጽ የቀን እንክብካቤ ስራዎች እና ቀጥተኛ ግንኙነት",
        "ዘመናዊ የእውቀት እና የክህሎት ማሳደጊያ ስርዓተ ትምህርት",
        "የመጀመሪያ ደረጃ የህክምና እርዳታ (CPR) የሰለጠኑ ሰራተኞች"
      ]
    },
    virtualTour: {
      title: "የህፃናት ማቆያችንን ይጎብኙ",
      welcome: "ወደ ኪድቶፒያ 360° ቪርቹዋል ጉብኝት እንኳን በደህና መጡ!",
      instructions: "ለመቃኘት ጠቅ ያድርጉ እና ይጎትቱ",
      editButton: "360 ጉብኝትን ያርትዑ",
      watchFull: "ሙሉ ቪርቹዋል ጉብኝቱን ይመልከቱ",
      schedule: "የአካል ጉብኝት ቀጠሮ ይያዙ",
      collageImage1: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1000&auto=format&fit=crop",
      collageImage2: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop",
      ratingText: "★ 4.9",
      ratingSubtext: "በወላጆች የተሰጠ ደረጃ",
      trustText: "100% ደህንነቱ የተጠበቀ",
      trustSubtext: "በሀኪም የተረጋገጠ",
      media: [
        { url: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=1200&h=675&auto=format&fit=crop", type: "image", description: "ውብ እና ሰፊ የመጫወቻ ስፍራችን።" },
        { url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop", type: "image", description: "ልጆች በደህና እና በፍቅር በሚማሩበት አካባቢ።" },
        { url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop", type: "image", description: "በቅድመ ትምህርት ቤት የልጆች ንቁ ተሳትፎ እና የፈጠራ ስራ።" }
      ]
    },
    dailyExperience: {
      title: "አንድ ቀን በኪድቶፒያ",
      subtitle: "ለእያንዳንዱ የዕድሜ ክልል ታስበው የተዘጋጁ የቀን መርሃግብሮች",
      schedules: [
        {
          id: "infants",
          name: "Infants",
          nameAm: "ሕፃናት",
          ageRange: "3 to 12 Months",
          ageRangeAm: "ከ 3 እስከ 12 ወራት",
          description: "ለቀዳሚ እድሜ ታዳጊዎቻችን ፍቅር የተሞላበት እንክብካቤ፣ የስሜት ህዋሳት እንቅስቃሴዎች፣ አመጋገብ እና ሰላማዊ የእረፍት ጊዜ።",
          descriptionAm: "ለቀዳሚ እድሜ ታዳጊዎቻችን ፍቅር የተሞላበት እንክብካቤ፣ የስሜት ህዋሳት እንቅስቃሴዎች፣ አመጋገብ እና ሰላማዊ የእረፍት ጊዜ።",
          timeline: [
            {
              time: "7:30 AM - 9:00 AM",
              activity: "Warm arrival, bottle feeding & gentle sensory play",
              activityAm: "ሞቅ ያለ አቀባበል፣ የምግብ/ወተት ሰዓት እና ቀላል የጨዋታ ጊዜ",
              image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop"
            },
            {
              time: "9:00 AM - 10:30 AM",
              activity: "Morning nap & soothing music relaxation",
              activityAm: "የጠዋት እንቅልፍ እና በሙዚቃ የተቀነባበረ የእረፍት ጊዜ",
              image: ""
            },
            {
              time: "10:30 AM - 11:30 AM",
              activity: "Tummy time, motor skill practice & outdoor buggy stroll",
              activityAm: "የሆድ ላይ ልምምድ፣ የእንቅስቃሴ ችሎታ ማሳደጊያ እና የውጪ አየር እረፍት",
              image: ""
            },
            {
              time: "11:30 AM - 12:30 PM",
              activity: "Midday feeding & organic puree tasting",
              activityAm: "የምሳ ሰዓት እና የተመጣጠነ ምግብ ቅመሳ",
              image: ""
            },
            {
              time: "12:30 PM - 2:30 PM",
              activity: "Restful afternoon sleep & quiet story nursery rhymes",
              activityAm: "የከሰአት እንቅልፍ እና የልጆች ታሪክ ማዳመጥ",
              image: ""
            },
            {
              time: "2:30 PM - 4:00 PM",
              activity: "Interactive puppet play & soft block exploration",
              activityAm: "የአሻንጉሊት ጨዋታዎች እና ለስላሳ እቃዎች አሰሳ",
              image: ""
            },
            {
              time: "4:00 PM - 5:30 PM",
              activity: "Evening wind-down, infant massage & parent pickup",
              activityAm: "የቀኑ ማጠቃለያ፣ የእጅና እግር ማሳጅ እና ለወላጆች ማስረከብ",
              image: ""
            }
          ]
        },
        {
          id: "toddlers",
          name: "Toddlers",
          nameAm: "ታዳጊዎች",
          ageRange: "1 to 2.5 Years",
          ageRangeAm: "ከ 1 እስከ 2.5 ዓመት",
          description: "ንቁ አሰሳ፣ የቋንቋ እድገት ልምምድ፣ የውጪ ጨዋታ እና የማህበራዊ ግንኙነት ትምህርት።",
          descriptionAm: "ንቁ አሰሳ፣ የቋንቋ እድገት ልምምድ፣ የውጪ ጨዋታ እና የማህበራዊ ግንኙነት ትምህርት።",
          timeline: [
            {
              time: "7:30 AM - 8:30 AM",
              activity: "Arrival, table toys & breakfast circle",
              activityAm: "አቀባበል፣ የጠረጴዛ ጨዋታዎች እና የቁርስ ክበብ",
              image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=800&auto=format&fit=crop"
            },
            {
              time: "8:30 AM - 9:30 AM",
              activity: "Morning greeting circle, song & fingerplay",
              activityAm: "የጠዋት ሰላምታ፣ መዝሙር እና የጣት ጨዋታዎች",
              image: ""
            },
            {
              time: "9:30 AM - 10:30 AM",
              activity: "Guided sensory exploration & finger painting",
              activityAm: "የስሜት ህዋሳት ጨዋታ እና በቀለም የመሳል ልምምድ",
              image: ""
            },
            {
              time: "10:30 AM - 11:30 AM",
              activity: "Outdoor playground time & gross motor obstacle course",
              activityAm: "የሜዳ ላይ ጨዋታዎች እና የአካል ብቃት እንቅስቃሴ",
              image: ""
            },
            {
              time: "11:30 AM - 12:30 PM",
              activity: "Nutritious hot lunch & handwashing routine",
              activityAm: "የምሳ ሰዓት እና የእጅ መታጠብ ልምድ ማሳደጊያ",
              image: ""
            },
            {
              time: "12:30 PM - 2:30 PM",
              activity: "Recharging nap time with soft lullabies",
              activityAm: "የእረፍት እና የእንቅስቃሴ ማደሻ ጊዜ",
              image: ""
            },
            {
              time: "2:30 PM - 3:30 PM",
              activity: "Afternoon healthy snack & storybook corner",
              activityAm: "የከሰአት መክሰስ እና የታሪክ መጽሐፍት ንባብ",
              image: ""
            },
            {
              time: "3:30 PM - 5:30 PM",
              activity: "Free play, music & movement circle, pickup",
              activityAm: "ነፃ ጨዋታ፣ የሙዚቃ እንቅስቃሴ እና ለወላጆች ማስረከብ",
              image: ""
            }
          ]
        },
        {
          id: "preschool",
          name: "Preschool",
          nameAm: "ቅድመ-ትምህርት ቤት",
          ageRange: "2.5 to 5 Years",
          ageRangeAm: "ከ 2.5 እስከ 5 ዓመት",
          description: "የሳይንስና ቴክኖሎጂ ትምህርት፣ የቋንቋና ፊደላት ልምምድ፣ ስነ-ጥበብ እና ለትምህርት ቤት ዝግጁ የማድረግ ፕሮግራም።",
          descriptionAm: "የሳይንስና ቴክኖሎጂ ትምህርት፣ የቋንቋና ፊደላት ልምምድ፣ ስነ-ጥበብ እና ለትምህርት ቤት ዝግጁ የማድረግ ፕሮግራም።",
          timeline: [
            {
              time: "7:30 AM - 8:30 AM",
              activity: "Welcome, morning table challenges & breakfast",
              activityAm: "አቀባበል፣ የጠዋት አእምሮ ማነቃቂያ እና ቁርስ",
              image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop"
            },
            {
              time: "8:30 AM - 9:30 AM",
              activity: "Morning assembly, calendar, weather & bilingual phonics",
              activityAm: "የጠዋት ሰብሰባ፣ የቀን መቁጠሪያ፣ የአየር ሁኔታ እና ባለሁለት ቋንቋ ልምምድ",
              image: ""
            },
            {
              time: "9:30 AM - 10:45 AM",
              activity: "STEM learning centers, math puzzles & early writing",
              activityAm: "የSTEM ሳይንስ ማዕከላት፣ የሒሳብ እንቆቅልሾች እና የጽሑፍ ልምምድ",
              image: ""
            },
            {
              time: "10:45 AM - 11:45 AM",
              activity: "Outdoor sports, cooperative games & nature exploration",
              activityAm: "የስፖርት እንቅስቃሴዎች፣ የቡድን ጨዋታዎች እና ከተፈጥሮ ጋር መተዋወቅ",
              image: ""
            },
            {
              time: "11:45 AM - 12:45 PM",
              activity: "Family-style lunch & social etiquette lessons",
              activityAm: "የቤተሰብ አይነት የምሳ ሰዓት እና የማህበራዊ ስነ-ምግባር ትምህርት",
              image: ""
            },
            {
              time: "12:45 PM - 2:15 PM",
              activity: "Rest or quiet reading & mindfulness relaxation",
              activityAm: "የእረፍት ወይም የፀጥታ ንባብ እና የአእምሮ ማረጋጊያ",
              image: ""
            },
            {
              time: "2:15 PM - 3:30 PM",
              activity: "Creative art studio, drama play & language lab",
              activityAm: "የስነ-ጥበብ ስቱዲዮ፣ ድራማ እና የቋንቋ ቤተ-ሙከራ",
              image: ""
            },
            {
              time: "3:30 PM - 5:30 PM",
              activity: "Afternoon snack, reflection circle & departure",
              activityAm: "የከሰአት መክሰስ፣ የቀኑ ማጠቃለያ እና ጉዞ ወደ ቤት",
              image: ""
            }
          ]
        }
      ],
      timeline: [
        { time: "ጥዋት", activity: "እንኳን ደህና መጡ እና መግቢያ", image: "" },
        { time: "ረፋድ", activity: "የመማሪያ እንቅስቃሴዎች", image: "" },
        { time: "ምሳ", activity: "ጤናማ የምግብ ሰዓት", image: "" },
        { time: "ከሰዓት", activity: "የእንቅልፍ እና የጸጥታ ሰዓት", image: "" },
        { time: "ከሰዓት በኋላ", activity: "መጫወት እና የፈጠራ ስራዎች", image: "" },
        { time: "ምሽት", activity: "ደህንነቱ የተጠበቀ የወላጅ መረከቢያ", image: "" }
      ]
    },
    faq: {
      title: "ተደጋግመው የሚጠየቁ ጥያቄዎች",
      items: [
        {
          question: "የጤና እና የክትባት ፖሊሲዎቻችሁ ምንድን ናቸው?",
          answer: "ሁሉም ልጆች ከመመዝገባቸው በፊት የክትባት፣ የሳንባ ነቀርሳ (TB)፣ የኤችአይቪ (HIV) እና የሄፓታይተስ ምርመራ ማቅረብ አለባቸው። የታመሙ ልጆች ለሌሎች ጤናማ አካባቢ ለመፍጠር ቤት መቆየት አለባቸው።"
        },
        {
          question: "የልጆች አወሳሰድ እና አምጣት ደህንነትን እንዴት ትቆጣጠራላችሁ?",
          answer: "ደህንነቱ የተጠበቀ ዲጂታል መግቢያ እና መውጫ ስርዓት እንጠቀማለን። ማንነታቸው የተረጋገጠ እና አስቀድሞ ፈቃድ የተሰጣቸው ሰዎች ብቻ ልጆችን መውሰድ ይችላሉ። ማንኛውም ለውጥ አስቀድሞ መታወቅ አለበት።"
        },
        {
          question: "የመጫወቻዎች እና የክፍሎች ንጽህና በስንት ጊዜ ልዩነት ይጸዳል?",
          answer: "የመጫወቻ ቁሳቁሶች፣ ብርድ ልብሶች እና መጫወቻዎች በየቀኑ በንጽህና ይታጠባሉ እንዲሁም ይጸዳሉ። ለአካባቢ ተስማሚ የሆኑ የንጽህና ቁሳቁሶችን እንጠቀማለን።"
        },
        {
          question: "የልጅ እና የአስተማሪ ጥምርታ ምን ያህል ነው?",
          answer: "ለእያንዳንዱ ልጅ በቂ ትኩረት ለመስጠት አነስተኛ የክፍል መጠኖችን እንይዛለን። ለእያንዳንዱ ክፍል በቂ ቁጥር ያላቸው ሞግዚቶች እና አስተማሪዎች ይመደባሉ።"
        }
      ]
    },
    testimonials: {
      title: "ወላጆች ምን ይላሉ",
      list: [
        { 
          name: "ረድኤት ሲሳይ", 
          text: "ልጄን ትቼ መሄድ መጀመሪያ ላይ ከባድ ነበር፣ ነገር ግን አስተማሪዎቹ ከመጀመሪያው ቀን ጀምሮ ምቾት እንዲሰማን እና እንድንደገፍ አድርገውናል።", 
          rating: 5, 
          image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop",
          workInfo: "ስራ ፈጣሪ"
        },
        { 
          name: "ሰላማዊት ገብረትንሳይ", 
          text: "ኪድቶፒያ የህፃናት ማቆያ ልጄ ከሌሎች ልጆች ጋር እንዲገናኝ ረድቶታል፣ ልጄ በደንብ መናገር የተማረበት ቦታ ነው፣ ሰራተኞቹ እንዲወደድ ያደርጉታል እና በአጠቃላይ በአዲስ አበባ ካየኋቸው የህፃናት ማቆያ ሁሉ ምርጡ ነው። 100% እመክረዋለሁ።", 
          rating: 5, 
          image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&h=100&auto=format&fit=crop",
          workInfo: "ፋርማሲስት"
        },
        { 
          name: "ሳምራዊት ካሳ", 
          text: "የኪድቶፒያ ዓለም አቀፍ የህፃናት ማቆያ እና ቅድመ ትምህርት ቤት አካል በመሆናችን በጣም እናመሰግናለን። ለእኔም ሆነ ለልጄ በእውነት አስደናቂ ተሞክሮ ሆኖልናል። በጣም ካደነቅኳቸው ነገሮች አንዱ የዕለታዊ ግንኙነት መጽሐፍ ነው። ስለ ልጄ ውሎ — ምን እንደምትበላ፣ መቼ እንደምትተኛ፣ ስለ እንቅስቃሴዎቿ እና ስለ ትንንሽ ዝርዝሮች ጭምር ሙሉ መረጃ ይሰጠኛል። ይህ የእንክብካቤ እና የግልፅነት ደረጃ ትልቅ የአእምሮ ሰላም ይሰጠኛል። አስተማሪዎቹ በሚያስደንቅ ሁኔታ ደግ፣ ጠባቂ እና ለልጆቹ በእውነት አፍቃሪ ናቸው።", 
          rating: 5, 
          image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=100&h=100&auto=format&fit=crop",
          workInfo: "የኪድቶፒያ ወላጅ"
        },
        { 
          name: "ሪሃና ይማም ሀሰን", 
          text: "ኪድቶፒያ በእውነት ለልጄ በጣም አስተማማኝ እና ተንከባካቢ ቦታ ነው። ከተቀላቀልን ጀምሮ በግንኙነት ችሎታዋ፣ በአጫዋወቷ እና በምግብ አጠቃቀም ልማዷ ላይ አስደናቂ መሻሻል አይቻለሁ። እሷ እንዲህ ባለው አሳቢ እና ደጋፊ አካባቢ ውስጥ መሆኗን ማወቅ ሙሉ የአእምሮ ሰላም ይሰጠኛል።", 
          rating: 5, 
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&h=100&auto=format&fit=crop",
          workInfo: "በ AFSIC አማካሪ"
        },
        { 
          name: "ዶ/ር ሰርካለም ኑርሌኝ", 
          text: "በኪድቶፒያ ልጃችን አፍቃሪ እና ተንከባካቢ አካባቢ አግኝቷል። ስለ ውሎው ወቅታዊ መረጃዎችን ማግኘት እንወዳለን። እሱ በጣም ደስተኛ ነው እና እዚያ ለመሆን በጉጉት ይጠብቃል። በእርግጠነት ኪድቶፒያን እመክራለሁ።", 
          rating: 5, 
          image: "https://images.unsplash.com/photo-1550525811-e5869dd03032?q=80&w=100&h=100&auto=format&fit=crop",
          workInfo: "የኪድቶፒያ ወላጅ"
        },
        { 
          name: "ምህረት በኃይሉ", 
          text: "በርካታ የህፃናት ማቆያዎችን እና ቅድመ ትምህርት ቤቶችን ጎብኝቻለሁ ነገር ግን በኪድቶፒያ የምቾት እና 'የቤትነት' ስሜት ተሰማኝ። የወሰኑት ሰራተኞች ሞቅ ያለ፣ አሳቢ እና ታታሪ መሆን ከደስተኛ እና ትምህርታዊ የክፍል መዋቅር ጋር ተዳምሮ በቤተሰባችን ላይ በእውነት አዎንታዊ ተጽእኖ አሳድሯል። ልጄ ሌላ ቦታ እንድትሄድ ማሰብ አልችልም!", 
          rating: 5, 
          image: "https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=100&h=100&auto=format&fit=crop",
          workInfo: "የኪድቶፒያ ወላጅ"
        }
      ]
    },
    cta: {
      title: "ለልጅዎ ምርጡን ጅምር ይስጡ",
      desc: "ዛሬ ኪድቶፒያ ዓለም አቀፍ የህፃናት ማቆያ እና ቅድመ ትምህርት ቤትን ይቀላቀሉ።",
      enroll: "ምዝገባ ይጀምሩ",
      bookTour: "ጉብኝት ያስይዙ",
      virtualTour: "ቪርቹዋል ጉብኝት ያድርጉ"
    },
    footer: {
      contact: "የእውቂያ መረጃ",
      links: "ፈጣን አገናኞች",
      resources: "የወላጆች መርጃ",
      resourceLinks: [
        { label: "የወላጅ መመሪያ", actionType: "handbook" },
        { label: "የተመጣጠነ ምግብ መመሪያ", actionType: "nutrition" },
        { label: "የኢትዮጵያ የህፃናት ማቆያ መመሪያ", actionType: "intl_act" },
        { label: "የተዋሃዱ የህፃናት ማቆያ ፖሊሲዎች", actionType: "intl_guidelines" }
      ],
      social: {
        facebook: "https://facebook.com",
        instagram: "https://instagram.com",
        telegram: "https://t.me",
        tiktok: "https://tiktok.com",
        youtube: "https://youtube.com"
      },
      addresses: [
        { 
          locationName: "ኪድቶፒያ ዓለም አቀፍ የህፃናት ማቆያ እና ቅድመ ትምህርት ቤት፣ አዲስ አበባ፣ ኢትዮጵያ", 
          googleMapsCoordinates: "9.0054,38.8475" 
        }
      ],
      phones: ["+251 911 000 000"],
      emails: ["info@kidtopia.com"],
      copyright: "© 2026 ኪድቶፒያ ዓለም አቀፍ የህፃናት ማቆያ እና ቅድመ ትምህርት ቤት። መብቱ በህግ የተጠበቀ ነው።",
      developedBy: "በአርሆ ቴክኖሎጂ የተገነባ",
      developerUrl: "https://arhotechnology.com"
    },
    resources: {
      title: "የወላጅ መርጃዎች",
      desc: "እርስዎን እና የልጅዎን ጉዞ ከእኛ ጋር ለመደገፍ አጋዥ ቁሳቁሶች እና መመሪያዎች።",
      items: [
        { title: "የወላጅ መመሪያ", description: "ስለ ፖሊሲዎቻችን፣ ዕለታዊ የጊዜ ሰሌዳዎች እና ምን እንደሚጠብቁ ማወቅ ያለብዎት ነገር ሁሉ።", type: "PDF ሰነድ", image: "", actionType: "handbook", link: "" },
        { title: "የተመጣጠነ ምግብ መመሪያ", description: "ስለ ጤናማ የምግብ እቅዶቻችን ይወቁ እና በቤት ውስጥ ለተመጣጠነ ምግብ ጠቃሚ ምክሮችን ያግኙ።", type: "መመሪያ", image: "", actionType: "nutrition", link: "" },
        { title: "የኢትዮጵያ የህፃናት ማቆያ መመሪያ ቁጥር 1084/2025", description: "በኢትዮጵያ ውስጥ ለህፃናት ማቆያ ማዕከላት የሚወጡ ይፋዊ መስፈርቶች፣ የአሠራር ሂደቶች፣ የቦታ እና የፈቃድ አሰጣጥ ደንቦች።", type: "ህጋዊ መመሪያ", image: "", actionType: "intl_act", link: "" },
        { title: "የተዋሃዱ የህፃናት ማቆያ ፖሊሲዎች እና መመሪያዎች", description: "የእኛን አጠቃላይ የህፃናት ማቆያ ደንቦች፣ የአገልግሎት ክፍያዎችን፣ የበሽታ ፖሊሲዎችን እና የወላጅ የስነ-ምግባር ደንቦችን እዚህ ያንብቡ።", type: "የወላጅ ፖሊሲ", image: "", actionType: "intl_guidelines", link: "" },
        { title: "የህፃናት ማቆያ መገናኛ ሶፍትዌር", description: "ለወላጆች የህፃናት ማቆያ መቆጣጠሪያ እና መገናኛ ሶፍትዌራችንን ያግኙ።", type: "የድር ፖርታል", image: "", actionType: "comms", link: "" },
        { title: "የልጅ እድገት ደረጃዎች", description: "የልጅዎን የእድገት ደረጃዎች፣ የዕውቀት እና የአካል ክህሎቶች ይከታተሉ።", type: "ደረጃ መከታተያ", image: "", actionType: "milestones", link: "" }
      ],
      handbookChapters: kidtopiaHandbookAm,
      menuDays: [
        {
          day: "ሰኞ",
          breakfast: "ኦርጋኒክ የአጃ ገንፎ ከአዲስ ሙዝ እና ንጹህ ማር ጋር",
          lunch: "የምስር ወጥ በከፍተኛ ፋይበር እንጀራ እና በእንፋሎት የበሰለ ጎመን",
          snack: "የተለያዩ የፍራፍሬ ቁርጥራጮች ከኦርጋኒክ እርጎ ጋር",
          allergens: ["gluten", "dairy"]
        },
        {
          day: "ማክሰኞ",
          breakfast: "ኦርጋኒክ የተጠበሰ እንቁላል በሙቅ የስንዴ ቶስት",
          lunch: "ቀላል የዶሮ ስጋ ከድንች እና ካሮት ጋር",
          snack: "የዱባ ፍሬዎች እና ቀይ ፖም",
          allergens: ["egg", "gluten"]
        },
        {
          day: "ረቡዕ",
          breakfast: "የገብስ በሶ በለውዝ ወተት",
          lunch: "አትክልት እና የሽንብራ ሽሮ ወጥ በስንዴ እንጀራ",
          snack: "የተጠበሰ ብስኩት ከአቮካዶ ፑሪ ጋር",
          allergens: ["gluten"]
        },
        {
          day: "ሐሙስ",
          breakfast: "የሙሉ ስንዴ ፓንኬክ በሜፕል ሲረፕ",
          lunch: "የአሳ ወጥ በቡናማ ሩዝ እና በአትክልት",
          snack: "የደረቀ የሙዝ ቺፕስ እና የብርቱካን ቁርጥራጮች",
          allergens: ["fish", "gluten"]
        },
        {
          day: "አርብ",
          breakfast: "አቮካዶ ቶስት ከኦርጋኒክ አይብ ጋር",
          lunch: "የበሬ ስጋ አልጫ ወጥ በጤፍ እንጀራ",
          snack: "የተጠበሰ የድንች ቺፕስ በማር",
          allergens: ["dairy", "gluten"]
        }
      ],
      milestonesData: {
        infant: {
          title: "ሕፃናት (ከ3 - 12 ወራት)",
          items: [
            { id: "i1", text: "ከሆድ ወደ ጀርባ እና ከጀርባ ወደ ሆድ ይገለበጣል" },
            { id: "i2", text: "ስሙ ሲጠራ ይላመዳል እንዲሁም በሚያውቋቸው ፊቶች ላይ ፈገግ ይላል" },
            { id: "i3", text: "እቃዎችን ለመያዝ ይዘረጋል" },
            { id: "i4", text: "ቀለል ያሉ ድምፆችን ያወጣል (ምሳሌ፡ 'ባ-ባ'፣ 'ዳ-ዳ')" },
            { id: "i5", text: "ያለ ድጋፍ ይቀመጣል" },
            { id: "i6", text: "የሚንቀሳቀሱ ነገሮችን በዓይኑ ይከተላል" }
          ]
        },
        toddler: {
          title: "ታዳጊዎች (ከ12 - 24 ወራት)",
          items: [
            { id: "t1", text: "በራሱ ይራመዳል እና መሮጥ ይጀምራል" },
            { id: "t2", text: "በርካታ ነጠላ ቃላትን እና ቀላል ባለ 2-ቃል ሀረጎችን ይናገራል" },
            { id: "t3", text: "ዕቃዎች ወይም ስዕሎች ሲጠሩ ይጠቁማል" },
            { id: "t4", text: "ቅርጾችን እና ቀለሞችን መለየት ይጀምራል" },
            { id: "t5", text: "ቀላል የማስመስል ጨዋታዎችን ይጫወታል (ለምሳሌ አሻንጉሊት መመገብ)" },
            { id: "t6", text: "ቀላል የአንድ-ደረጃ የቃል መመሪያዎችን ይከተላል" }
          ]
        },
        preschool: {
          title: "ቅድመ ትምህርት ቤት (ከ2 - 4 ዓመታት)",
          items: [
            { id: "p1", text: "በጥሩ ሁኔታ ይወጣል እና በቀላሉ ይሮጣል" },
            { id: "p2", text: "ከ3-4 ቃላት ባሉት ዓረፍተ ነገሮች ይናገራል" },
            { id: "p3", text: "አዝራሮች፣ ማንሻዎች እና ተንቀሳቃሽ ክፍሎች ያሏቸውን መጫወቻዎች ማንቀሳቀስ ይችላል" },
            { id: "p4", text: "በቀለም እርሳስ ወይም እርሳስ ክብ መቅዳት ይችላል" },
            { id: "p5", text: "ለጓደኞቹ ፍቅር ያሳያል እና ሰፊ ስሜቶችን ይገልጻል" },
            { id: "p6", text: "በጨዋታዎች ውስጥ ተራ ይይዛል እና 'የእኔ' እና 'የእነሱ' የሚለውን ይረዳል" }
          ]
        },
        kinder: {
          title: "ኪንደርጋርተን (ከ4 - 5 ዓመታት)",
          items: [
            { id: "k1", text: "በበለጠ ግልጽ በሆነ ሁኔታ ይናገራል እና ቀላል ታሪኮችን ይነግራል" },
            { id: "k2", text: "10 ወይም ከዚያ በላይ እቃዎችን መቁጠር ይችላል" },
            { id: "k3", text: "ቢያንስ 6 የሰውነት ክፍሎች ያሉት ሰው ይስላል" },
            { id: "k4", text: "አንዳንድ ፊደላትን ወይም ቁጥሮችን ይጽፋል፣ እና ሶስት ማዕዘን ይገለብጣል" },
            { id: "k5", text: "በአንድ እግሩ ለ10 ሰከንድ ወይም ከዚያ በላይ ይቆማል" },
            { id: "k6", text: "በእውነተኛ እና በማስመስል መካከል ያለውን ልዩነት ይረዳል" }
          ]
        }
      },
      intlActTitle: "የኢትዮጵያ የህፃናት ማቆያ መመሪያ ቁጥር 1084/2025 መስፈርቶች",
      intlActBody: `የኢትዮጵያ የህፃናት ማቆያ መመሪያ ቁጥር 1084/2025 ዝርዝር

ኪድቶፒያ ዓለም አቀፍ የህፃናት ማቆያ በኢትዮጵያ ፍትህ ሚኒስቴር (በመመሪያ ቁጥር 1084/2025 መሠረት) የወጡትን የደህንነት፣ የቦታ፣ የትምህርት እና የንጽህና መስፈርቶች ሙሉ በሙሉ ያከብራል። በማዕከላችን ውስጥ ተግባራዊ የሚደረጉት ዋና ዋና የቁጥጥር መስፈርቶች እና ደረጃዎች የሚከተሉት ናቸው፡-

1. ፈቃድ እና የቁጥጥር ደረጃዎች (አንቀጽ 4 እና 7)
• የፈቃድ ሰጪ አካል፡ በኢትዮጵያ ውስጥ የሚገኝ ማንኛውም የህፃናት ማቆያ ማዕከል ከሚመለከተው የማዘጋጃ ቤት/የክልል የቁጥጥር ቢሮዎች ኦፊሴላዊ ምዝገባ ማግኘት እና አመታዊ ምርመራ ማድረግ አለበት።
• የሥራ ፈቃድ፡ ኪድቶፒያ ሁሉንም ቴክኒካዊ፣ አካባቢያዊ እና የቦታ ደህንነት መስፈርቶችን የሚያሟላ ህጋዊ የሥራ ፈቃድ አለው።

2. አካላዊ ቦታ እና መሰረተ ልማት (አንቀጽ 10 እና 11)
• የቦታ መስፈርቶች፡ የእያንዳንዱ ህጻን ማቆያ ለአንድ ህጻን ቢያንስ 2.5 ካሬ ሜትር ንጹህ የውስጥ ክፍል ማቅረብ አለበት።
• የክፍል ደህንነት፡ የመማሪያ ክፍሎች በቂ የተፈጥሮ አየር ዝውውር፣ ደማቅ ብርሃን፣ ለህፃናት ምቹ የሆኑ የጠርዝ ክብ የቤት ዕቃዎች ሊኖሯቸው የሚገባ ሲሆን ከሹል እቃዎች ወይም አደገኛ ንጥረ ነገሮች የጸዱ መሆን አለባቸው።
• የውጭ መጫወቻ ቦታ፡ ህጻናት ያለ ምንም የትራፊክ አደጋ በየቀኑ ንቁ መዝናኛ እንዲያገኙ የታጠረ፣ አስተማማኝ የመጫወቻ ቦታ መኖር ግዴታ ነው።

3. የአሳዳጊ ሰራተኛ እና የህፃናት ጥምርታ (አንቀጽ 14)
ከፍተኛ ጥራት ያለው የግል እንክብካቤን ለማረጋገጥ የአሳዳጊ ሰራተኞች እና የህፃናት ጥምርታ በህግ ተደንግጓል፡-
• ህፃናት (ከ 1 አመት በታች)፡ 1 አሳዳጊ ለ 3 ህፃናት (የ 1:3 ጥምርታ)
• ታዳጊዎች (ከ 1 እስከ 2 ዓመት)፡ 1 አሳዳጊ ለ 5 ታዳጊዎች (የ 1:5 ጥምርታ)
• የቅድመ ትምህርት ቤት ህጻናት (ከ 3 እስከ 5 ዓመት)፡ 1 አሳዳጊ ለ 8 ህጻናት (የ 1:8 ጥምርታ)
ኪድቶፒያ ደህንነትን ለመጠበቅ እነዚህን ጥምርታዎች በጥብቅ ያከብራል ወይም ከእነሱ በተሻለ ሁኔታ ያደራጃል።

4. የሰራተኞች ምስክር ወረቀት እና ጤና (አንቀጽ 15 እና 16)
• የምስክር ወረቀት፡ መሪ አስተማሪዎች እና የእንክብካቤ ሰራተኞች በቅድመ ልጅነት ትምህርት (ECE) ወይም በተመሳሳይ የሰለጠኑ መሆን አለባቸው።
• የበስተጀርባ ታሪክ ምርመራ፡ ሁሉም ሰራተኞች የህጻናትን ደህንነት ለማረጋገጥ የወንጀል ታሪክ ምርመራ ይደረግባቸዋል።
• የጤና ማረጋገጫ፡ ሰራተኞች በህጻናት ደህንነት ላይ ጉዳት ሊያደርሱ ከሚችሉ ተላላፊ፣ አእምሯዊ ወይም አካላዊ በሽታዎች የጸዱ መሆናቸውን የሚገልጽ የጤና ማረጋገጫ ማቅረብ አለባቸው።

5. ጤና، ንጽህና እና የህክምና ምርመራዎች (አንቀጽ 18)
• የህፃናት የጤና ካርዶች፡ ሁሉም ህጻናት ወቅታዊ የክትባት ሰነድ (ኩፍኝ፣ ፖሊዮ፣ ቢሲጂ፣ ዲፒቲ) እና ከተላላፊ በሽታዎች ነጻ መሆናቸውን የሚገልጽ የህክምና ማስረጃ ማቅረብ አለባቸው።
• የእለት ተእለት የጤና ምርመራ፡ ህጻናት በየቀኑ ሲገቡ የሚታዩ የበሽታ ምልክቶች ካሉ ይመረመራሉ።
• የጽዳት ስራዎች፡ የመጫወቻ እቃዎች፣ የመጸዳጃ ቤቶች እና የመኝታ ልብሶች በየቀኑ በፀረ-ተባይ ይጸዳሉ።

6. ደህንነት፣ የአደጋ ጊዜ እና የደህንነት ጥበቃ
• የአደጋ ጊዜ እቅዶች፡ በዓመት ሁለት ጊዜ የአደጋ ጊዜ የእሳት አደጋ ልምምዶች ይካሄዳሉ።
• ጥብቅ መግቢያ/መውጫ፡ የመግቢያ በሮች ሁልጊዜ የተቆለፉ ናቸው። በስልካቸው ደህንነቱ የተጠበቀ የQR ኮድ ማረጋገጫ ያላቸው የተመዘገቡ ወላጆች ብቻ ወደ ግቢው መግባት ይችላሉ።`,
      intlGuidelinesTitle: "የተዋሃዱ የህፃናት ማቆያ ፖሊሲዎች እና ውሎች",
      intlGuidelinesBody: `ኪድቶፒያ ዓለም አቀፍ የህፃናት ማቆያ - የተዋሃዱ የአሠራር ፖሊሲዎች

ወደ ኪድቶፒያ ወላጆች ማህበረሰብ እንኳን በደህና መጡ! ልጅዎን በማስመዝገብ ከእኛ ጋር አጋርነት ውስጥ ይገባሉ። የእኛ የተዋሃዱ የአሠራር ደንቦች፣ የክፍያ ሥርዓቶች፣ የደህንነት ፕሮቶኮሎች እና የስነ-ምግባር ደንቦች የሚከተሉት ናቸው፡-

1. ምዝገባ፣ የሥራ ሰዓት እና የዘግይቶ መውጫ ክፍያ
• የሥራ ሰዓት፡ ማዕከሉ ከሰኞ እስከ አርብ ከጠዋቱ 1:30 እስከ ምሽቱ 12:00 ሰዓት ክፍት ነው።
• በሰዓቱ መድረስ፡ ህጻናት በጠዋቱ የቡድን እንቅስቃሴዎች ላይ እንዲሳተፉ ከጠዋቱ 2:30 በፊት እንዲደርሱ እንመክራለን።
• የዘግይቶ መውጫ ክፍያ፡ ህጻናት እስከ ምሽቱ 12:00 ሰዓት መወሰድ አለባቸው። ከዚያ በኋላ ለሚዘገይ ለእያንዳንዱ 15 ደቂቃ 200 የኢትዮጵያ ብር የቅጣት ክፍያ ይታሰባል።

2. የክፍያ ውሎች እና የአሠራር ሥርዓቶች
• የወር ክፍያ፡ የትምህርት ክፍያ በየወሩ አስቀድሞ ይከፈላል። የክፍያ መጠየቂያ ደረሰኞች በየወሩ በ25ኛው ቀን ይላካሉ።
• የክፍያ የመጨረሻ ቀን፡ የትምህርት ክፍያ በየወሩ ከ1ኛው ቀን በፊት መከፈል አለበት። ከ6ኛው ቀን በኋላ ክፍያው ካልተፈጸመ የ10% ቅጣት ይታሰባል።
• ምዝገባ የመሰረዝ ፖሊሲ፡ ልጅዎን ለማስወጣት የ30 ቀናት የጽሁፍ ቅድመ ማስጠንቀቂያ መስጠት አለብዎት። ይህ ካልሆነ የያዙት የዋስትና ክፍያ አይመለስም።

3. የጤና፣ የበሽታ እና የመድኃኒት አሰጣጥ ፖሊሲ
• የታመመ ልጅ መመሪያ፡ ሌሎችን ለመጠበቅ፣ ህጻናት የሚከተሉት ምልክቶች ካሏቸው ቤት መቆየት አለባቸው፡-
  - ትኩሳት ከ 38 ዲግሪ ሴልሺየስ በላይ ከሆነ
  - ባለፉት 24 ሰዓታት ውስጥ ማስታወክ ወይም ተቅማጥ ካጋጠማቸው
  - ያልታወቀ የቆዳ ሽፍታ ወይም ተላላፊ በሽታዎች ካሉ
• ወደ ማቆያ መመለስ፡ ህጻናት ትኩሳትን የሚቀንሱ መድኃኒቶችን ሳይጠቀሙ ቢያንስ ለ24 ሰዓታት ከትኩሳት እና ከምልክቶች ነጻ መሆናቸው ሲረጋገጥ ብቻ ይመለሳሉ።
• የታዘዘ መድኃኒት፡ ሰራተኞች መድኃኒት የሚሰጡት በሐኪም የታዘዘ ማስታወሻ ከዋናው የመድኃኒት መያዣ ጋር ሲቀርብ ብቻ ነው።

4. የደህንነት እና የQR ኮድ አጠቃቀም
• የተፈቀደለት ሰው፡ በፖርታሉ ላይ የተመዘገቡ እና ህጋዊ መታወቂያ ያላቸው ወይም ደህንነቱ የተጠበቀ የQR ኮድ ያሏቸው ወላጆች ብቻ ህጻናትን መውሰድ ይችላሉ።
• የአደጋ ጊዜ እውቂያ፡ ሌላ ሰው ልጅዎን እንዲወስድ ከፈለጉ ቢያንስ ከ2 ሰዓታት በፊት በጽሁፍ ማሳወቅ ወይም መደወል አለብዎት።

5. የስነ-ምግባር ደንብ እና ዲሲፕሊን
• አዎንታዊ መመሪያ፡ እኛ የምንጠቀመው አዎንታዊ ማበረታቻን፣ ትኩረትን ማዞር እና ንቁ ግጭት መፍታትን ነው። የአካል ቅጣት ወይም መጮህ በጥብቅ የተከለከለ ነው።
• የወላጆች ባህሪ፡ ኪድቶፒያ በአስተማሪዎች እና በሰራተኞች ላይ ለሚሰነዘሩ ጩኸቶች፣ ዛቻዎች ወይም ትንኮሳዎች ምንም አይነት መቻቻል የለውም። ይህንን የሚጥሱ ወላጆች ያለ ምንም የክፍያ ተመላሽ ልጅ ከተቋሙ ወዲያውኑ እንዲሰረዝ ይደረጋል።

6. የሞባይል እና ዲጂታል መሳሪያዎች ፖሊሲ
• የኤሌክትሮኒክስ መጫወቻዎች ክልክል ናቸው፡ ታብሌቶች፣ ሞባይል ስል科ች ወይም የኤሌክትሮኒክስ መጫወቻዎች ወደ መማሪያ ክፍል ይዞ መግባት በጥብቅ የተከለከለ ነው።
• ዓላማ፡ በንቃት መጫወት፣ መጽሐፍትን ማንበብ እና ማህበራዊ ግንኙነትን ማሳደግ ላይ እናተኩራለን።`,
      policiesAndRegulations: kidtopiaHandbookAm
    },
    leadCapture: {
      title: "የጉብኝት ቀጠሮ መያዝ ይፈልጋሉ?",
      text: "የኪድቶፒያ ድንቅ አካባቢን ለማየት የአካል ጉብኝት ቀጠሮ ይያዙ።",
      buttonText: "ጉብኝት ያስይዙ",
      buttonLink: "/book-tour",
      laterText: "በኋላ",
      type: "info",
      enabled: "true"
    },
    staff: {
      title: "የእኛ ፕሮፌሽናል ሰራተኞች",
      showLess: "ያነሰ አሳይ",
      seeMore: "ተጨማሪ ሰራተኞችን ይመልከቱ",
      members: [
        { name: "ፋኢዛ ኢብራሂም", role: "የትምህርት ቤት ነርስ", desc: "በኪድቶፒያ ለእያንዳንዱ ልጅ ጤና እና ደህንነት የተሰጠች።", image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=600&auto=format&fit=crop" },
        { name: "ሚስ መቅደስ አለሙ", role: "ዋና መምህርት", desc: "በቅድመ ልጅነት ትምህርት እና በልጅ እድገት ላይ ባለሙያ።", image: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop" },
        { name: "ሚስ ሀያት ሰይድ", role: "ተንከባካቢ", desc: "ለታዳጊዎቻችን አሳቢ እና ደጋፊ አካባቢን መስጠት።", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop" },
        { name: "ሚስ አለሚቱ አበበ", role: "የቅድመ ትምህርት ቤት አስተማሪ", desc: "ትላልቅ ልጆቻችንን ወደ ትምህርት ቤት ለስላሳ ሽግግር ማዘጋጀት።", image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=600&auto=format&fit=crop" }
      ]
    },
    login: {
      title: "እንኳን ደህና መጡ",
      subtitle: "ወደ ወላጅ ወይም ሰራተኛ ፖርታል ለመግባት ይግቡ",
      email: "የኢሜይል አድራሻ",
      password: "የይለፍ ቃል",
      role: "ሚና ይምረጡ",
      admin: "አስተዳዳሪ",
      parent: "ወላጅ",
      staff: "ሰራተኛ",
      submit: "ግባ",
      forgotPassword: "የይለፍ ቃል ረሱ?",
      noAccount: "መለያ የለዎትም?",
      contactUs: "ያግኙን"
    },
    reschedule: {
      backToHome: "ወደ መነሻ ይመለሱ",
      title: "ጉብኝትዎን እንደገና ያስይዙ",
      notFound: "ቀጠሮው አልተገኘም።",
      alreadyProcessed: "ይህ ቀጠሮ ቀድሞ ተካሂዷል እና እዚህ እንደገና ሊዘጋጅ አይችልም። እባክዎ በቀጥታ ያግኙን።",
      failedToLoad: "የቀጠሮ ዝርዝሮችን መጫን አልተቻለም።",
      failedToUpdate: "ቀጠሮውን ማዘመን አልተቻለም። እባክዎ እንደገና ይሞክሩ።",
      success: "ጉብኝቱ በተሳካ ሁኔታ እንደገና ተቀጥሯል!",
      successDesc: "አዲሱ የጠየቁት የጉብኝት ሰዓት በ {date} በ {time} ነው። ቀጠሮዎ ሲጸድቅ እናሳውቅዎታለን።",
      currentRequest: "የአሁኑ ጥያቄ:",
      date: "ቀን፡",
      time: "ሰዓት፡",
      selectNewDate: "አዲስ ቀን ይምረጡ",
      selectNewTime: "አዲስ ሰዓት ይምረጡ",
      noSlots: "በጊዜ ሰሌዳው ውስጥ ምንም ክፍት ቦታ የለም።",
      pleaseSelectDate: "እባክዎ መጀመሪያ ቀን ይምረጡ።",
      updating: "በማዘመን ላይ...",
      updateButton: "የጉብኝት ሰዓቱን ያዘምኑ"
    },
    enrollmentPage: {
      title: "የምዝገባ መረጃ እና የሚያስፈልጉ ሰነዶች",
      subtitle: "የኪድቶፒያ ምዝገባ መመሪያ እንኳን በደህና መጡ። እባክዎ ወደ ኦንላይን መመዝገቢያ ቅጽ ከመሄድዎ በፊት የሚከተሉትን ሰነዶች ያዘጋጁ።",
      processTitle: "ባለ 4-ደረጃ የምዝገባ ሂደት",
      processSteps: [
        { step: "1", title: "ቅድመ ሁኔታዎችን ይገምግሙ", desc: "ልጅዎ የዕድሜ መስፈርቱን (1.5 - 6 ዓመት) ማሟላቱን እና አጠቃላይ ሰነዶችን ማዘጋጀትዎን ያረጋግጡ።" },
        { step: "2", title: "ሰነዶችን ያዘጋጁ", desc: "የማንነት መረጃ፣ የህክምና መዛግብት እና የተለዩ የጤና ምርመራዎችን ያሰባስቡ።" },
        { step: "3", title: "የምዝገባ ፎርም ይሙሉ", desc: "ኦፊሴላዊውን የማመልከቻ ቅጽ ለመሙላት በዚህ ገጽ ግርጌ ያለውን 'ይቀጥሉ' ቁልፍን ይጫኑ።" },
        { step: "4", title: "ማረጋገጫ እና ቅበላ", desc: "የመግቢያ ክፍላችን ሰነዶችን ያረጋግጣል፣ ቦታን ያረጋግጣል፣ እና የቅበላ ክፍለ ጊዜ ቀጠሮ ይይዛል።" }
      ],
      documentsTitle: "የሚያስፈልጉ የምዝገባ ሰነዶች",
      documentsDesc: "የልጅዎን ቦታ ለማስጠበቅ ከዚህ በታች ያሉትን ሁሉንም ሰነዶች በምዝገባ ወቅት ማቅረብ አለብዎት።",
      documentsList: [
        { title: "የወላጅ/አሳዳጊ ብሔራዊ መታወቂያ ወይም ፓስፖርት", desc: "የዋናው አሳዳጊ ህጋዊ መታወቂያ (ብሔራዊ መታወቂያ ካርድ ወይም ፓስፖርት) ግልጽ ኮፒ።" },
        { title: "የልጁ የልደት ምስክር ወረቀት", desc: "የልጁን ዕድሜ እና የወላጅነት ዝምድና ለማረጋገጥ ይፋዊ የልደት ምስክር ወረቀት።" },
        { title: "የክትባት ካርድ / የጤና መዝገብ", desc: "የቢጫ ወባ፣ የፖሊዮ እና ሌሎች የልጅነት ክትባቶችን የሚያሳይ ወቅታዊ የክትባት ካርድ።" },
        { title: "የጤና ሁኔታ እና የህክምና መግለጫ", desc: "ቅድመ-ነባር የህክምና ሁኔታዎች፣ የምግብ አለርጂዎች ወይም ልዩ እንክብካቤ ፍላጎቶችን የሚያሳዩ ዝርዝር መረጃዎች።" },
        { title: "የልጆች ጤና ምርመራ ውጤቶች (ሄፓታይተስ፣ ኤችአይቪ፣ ቲቢ)", desc: "ለሄፓታይተስ ቢ፣ ለኤችአይቪ (HIV) እና ለሳንባ ነቀርሳ (TB) ምርመራ በቅርብ ጊዜ የተደረጉ የላብራቶሪ ምርመራ ውጤቶች።" },
        { title: "የፓስፖርት ፎቶግራፎች", desc: "የልጁ እና የወላጆች/የተፈቀደላቸው ተቀባዮች የቅርብ ጊዜ የፓስፖርት መጠን ፎቶግራፎች።" }
      ],
      proceedButton: "ወደ ኦንላይን የምዝገባ ቅጽ ይቀጥሉ",
    },
    softwareShowcase: {
      badge: "የቀን ማቆያ ዌብ ሲስተም",
      title: "ከምዝገባ እስከ ህፃናት መውጫ - በኪድቶፒያ ዌብ ፖርታል የተደገፈ",
      subtitle: "ግልጽነት ለታማኝነት ዋናው መሠረት እንደሆነ እናምናለን። ለዚህም ነው በእያንዳንዱ ሰከንድ ደህንነትዎን ለመጠበቅ እና መረጃ ለማድረስ የእኛን ልዩ የሶፍትዌር ስርዓት የዘረጋነው።",
      parentDashboardTitle: "የወላጆች መቆጣጠሪያ ሰሌዳ (Dashboard)",
      parentDashboardDesc: "ወላጆች የእውነተኛ ጊዜ ዝመናዎችን፣ የጤና ሁኔታዎችን፣ ዕለታዊ አመጋገብን እና ከተንከባካቢዎች ጋር ቀጥተኛ ግንኙነትን የሚያገኙበት ዘመናዊ ፖርታል አላቸው።",
      uploadLabel: "ለመቀየር በአድሚን ፓነል ውስጥ እውነተኛ ስክሪንሾት ይጫኑ",
      uploadFormat: "PNG፣ JPG ወይም WebP ይደግፋል። ነባሪውን ምስል ይቀይራል።",
      changeScreenshot: "አዲስ ስክሪንሾት ለመቀየር",
      useFallback: "ወደ ነባሪው የሶፍትዌር ንድፍ ይመለሱ",
      tabRegistration: "1. የኢንተርኔት ምዝገባ",
      tabDashboard: "2. የወላጅ ዳሽቦርድ",
      tabQrcode: "3. በQR ኮድ መውሰጃ",
      regTitle: "ቀላል እና ፈጣን የበይነመረብ ምዝገባ",
      regDesc: "የወረቀት ስራዎችን ያስቀሩ። በ 5 ደቂቃዎች ውስጥ ልጅዎን ይመዝግቡ፣ የህክምና መግለጫዎችን ይሙሉ፣ እና የክትባት ካርዶችን በቀላሉ ያስገቡ።",
      dashTitle: "የወላጅ መቆጣጠሪያ እና የቀጥታ መረጃ ፍሰት",
      dashDesc: "ምግብ፣ እንቅልፍ እና የእንቅስቃሴ ሪፖርቶች። ልጆችዎ በእውቀት ማሳደጊያ ስራዎች ላይ ሲሳተፉ የሚያሳዩ ልዩ የፎቶ ዝመናዎችን ያግኙ።",
      qrcodeTitle: "ደህንነቱ የተጠበቀ የQR ኮድ መውሰጃ እና የዕለት ሪፖርት",
      qrcodeDesc: "ደህንነቱ የተጠበቀ የQR ኮድ መውሰጃ። ወላጆች በስልካቸው የሚመነጨውን የQR ኮድ በመጠቀም ልጆቻቸውን በታማኝነት መውሰድ ይችላሉ። በተጨማሪም የልጃቸውን የዕለት ተዕለት የእንቅስቃሴ፣ የባህሪ እና የአመጋገብ ትንተና ሪፖርቶች ማየት ይችላሉ።",
      regBullet1: "ዲጂታል የክትባት ካርድና የህክምና ፎርሞች ማቅረቢያ",
      regBullet2: "ዕለታዊ የሰዓት መርሐ-ግብር ምርጫና መለያ ማስተካከያ",
      regBullet3: "ፈጣን የኢሜይል ማረጋገጫና የመቀበያ ሰነዶች ዝግጅት",
      dashBullet1: "የእንቅልፍ፣ የምግብና የፈሳሽ ዝርዝር ዝመናዎች ማሳያ",
      dashBullet2: "ደህንነቱ የተጠበቀ የዕለት ተዕለት የእንቅስቃሴ ቀጥታ ፎቶዎች",
      dashBullet3: "የጤና እና የሰውነት ሙቀት መለኪያ ሪፖርት መዝገብ",
      qrcodeBullet1: "ለወላጆች ደህንነቱ የተጠበቀ የQR ኮድ ማመንጫ",
      qrcodeBullet2: "የልጁ የዕለት ተዕለት የእንቅስቃሴ፣ የባህሪ እና የአመጋገብ ሪፖርት",
      qrcodeBullet3: "ልጁ ሲወጣ ለወላጆች ፈጣን የኤስኤምኤስ (SMS) መልእክት",
      infoHighlight: "ወላጆች የራሳቸው የዳሽቦርድ መለያ አላቸው። በምናሌው ላይ ያለውን \"ግባ\" ቁልፍ በመጫን መግባት ይችላሉ።"
    }
  }
};
