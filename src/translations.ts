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
      subheadline: "Welcome to Kidtopia International Daycare and Preschool — where children learn, play, and thrive in a secure and nurturing environment.",
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
        { title: "Small Class Sizes", desc: "Personal attention for every child", image: "" }
      ]
    },
    safety: {
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
        "Real-time parent communication",
        "Daily digital activity reports",
        "Healthy and safe environment",
        "Small class sizes",
        "Secure child pickup system",
        "Transparent daycare operations"
      ]
    },
    virtualTour: {
      title: "Explore Our Daycare",
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
      emails: ["info@kidtopia.com"]
    },
    resources: {
      title: "Parent Resources",
      desc: "Helpful materials and guides to support you and your child's journey with us.",
      items: [
        { title: "Parent Handbook", description: "Everything you need to know about our policies, daily schedules, and what to expect.", type: "PDF Document", image: "", actionType: "handbook", link: "" },
        { title: "Enrollment Forms", description: "Download and print the necessary forms to begin the enrollment process.", type: "PDF Forms", image: "", actionType: "forms", link: "https://example.com/forms/enrollment-form.pdf" },
        { title: "AR Simulator Game", description: "Interactive Augmented Reality simulator for fun and creative learning.", type: "Interactive Game", image: "", actionType: "ar_activities", link: "" },
        { title: "Nutrition Guide", description: "Learn about our healthy meal plans and get tips for nutritious eating at home.", type: "Guide", image: "", actionType: "nutrition", link: "" },
        { title: "Profile Avatar Creator", description: "Design a unique custom character avatar for you and your child's portal profile.", type: "Interactive Tool", image: "", actionType: "avatar", link: "" },
        { title: "Development Milestones", description: "Track your child's age-appropriate developmental stages, cognitive and motor skills.", type: "Milestone Tracker", image: "", actionType: "milestones", link: "" }
      ]
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
      externalEnrollmentUrl: "https://kidtopia-main-u5x6pj.laravel.cloud/enroll"
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
      subheadline: "ወደ ኪድቶፒያ ዓለም አቀፍ የህፃናት ማቆያ እና ቅድመ ትምህርት ቤት እንኳን በደህና መጡ — ህፃናት ደህንነቱ በተጠበቀ እና በሚንከባከብ አካባቢ የሚማሩበት፣ የሚጫወቱበት እና የሚበለጽጉበት።",
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
        { title: "አነስተኛ የክፍል መጠኖች", desc: "ለእያንዳንዱ ልጅ የግል ትኩረት", image: "" }
      ]
    },
    safety: {
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
        "የእውነተኛ ጊዜ የወላጅ ግንኙነት",
        "ዕለታዊ ዲጂታል የእንቅስቃሴ ሪፖርቶች",
        "ጤናማ እና ደህንነቱ የተጠበቀ አካባቢ",
        "አነስተኛ የክፍል መጠኖች",
        "ደህንነቱ የተጠበቀ የህፃናት መውሰጃ ስርዓት",
        "ግልጽ የቀን እንክብካቤ ስራዎች"
      ]
    },
    virtualTour: {
      title: "የህፃናት ማቆያችንን ይጎብኙ",
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
          name: "ፋኢዛ ኢብራሂም", 
          text: "ኪድቶፒያ የአእምሮ ሰላም ይሰጠናል። ዕለታዊ መረጃዎችን እናገኛለን እና ልጃችን አካባቢውን ይወደዋል።", 
          rating: 5, 
          image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop",
          workInfo: "የአርሆ ቴክኖሎጂ ዋና ስራ አስፈፃሚ"
        },
        { 
          name: "ፈዋዝ ሰኢድ አህመድ", 
          text: "አሪፍ ነው", 
          rating: 5, 
          image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&h=100&auto=format&fit=crop",
          workInfo: "የኪድቶፒያ ወላጅ"
        },
        { 
          name: "እመቤት ጌታሁን", 
          text: "ኪድቶፒያ ለልጃችን ምርጥ እና ምቹ ቦታ ሆኖ አግኝቼዋለሁ ከበር ጀምሮ ያለው አቀባበላችሁ ለልጆቹም ለወላጅም ይማርካል ቀጥሉበት በልጃችን ላይ ብዙ ጥሩ ለውጦችን አይተናል የኔ ልጅ ሲመጣ እየናፈቀ ነው ሚመጣው ተናፋቂ ናችሁ!ልጄ እናተ ጋር ሲውል ለደህንነቱ ተማምኜ ነው እምውለው የመጣሁትም ስለእናተ የልጅ አያያዝ ጥሩ ምስክርነት ሰምቼ ነበር የበለጠ ሆኖ አግኝቼዋለሁ እኔም ልጄም እንወዳችኃለን!", 
          rating: 5, 
          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&h=100&auto=format&fit=crop",
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
      emails: ["info@kidtopia.com"]
    },
    resources: {
      title: "የወላጅ መርጃዎች",
      desc: "እርስዎን እና የልጅዎን ጉዞ ከእኛ ጋር ለመደገፍ አጋዥ ቁሳቁሶች እና መመሪያዎች።",
      items: [
        { title: "የወላጅ መመሪያ", description: "ስለ ፖሊሲዎቻችን፣ ዕለታዊ የጊዜ ሰሌዳዎች እና ምን እንደሚጠብቁ ማወቅ ያለብዎት ነገር ሁሉ።", type: "PDF ሰነድ", image: "", actionType: "handbook", link: "" },
        { title: "የምዝገባ ቅጾች", description: "የምዝገባ ሂደቱን ለመጀመር አስፈላጊዎቹን ቅጾች ያውርዱ እና ያትሙ።", type: "PDF ቅጾች", image: "", actionType: "forms", link: "https://example.com/forms/enrollment-form.pdf" },
        { title: "ኤአር አስመሳይ ጨዋታ", description: "በይነተገናኝ የተጨመረው እውነታ (AR) አስመሳይ ለአስደሳች እና ፈጠራዊ ትምህርት።", type: "በይነተገናኝ ጨዋታ", image: "", actionType: "ar_activities", link: "" },
        { title: "የተመጣጠነ ምግብ መመሪያ", description: "ስለ ጤናማ የምግብ እቅዶቻችን ይወቁ እና በቤት ውስጥ ለተመጣጠነ ምግብ ጠቃሚ ምክሮችን ያግኙ።", type: "መመሪያ", image: "", actionType: "nutrition", link: "" },
        { title: "የአቫታር መፍጠሪያ", description: "ለእርስዎ እና ለልጅዎ የሚሆን ልዩ መገለጫ አቫታር ይንደፉ።", type: "በይነተገናኝ መሣሪያ", image: "", actionType: "avatar", link: "" },
        { title: "የልጅ እድገት ደረጃዎች", description: "የልጅዎን የእድገት ደረጃዎች፣ የዕውቀት እና የአካል ክህሎቶች ይከታተሉ።", type: "ደረጃ መከታተያ", image: "", actionType: "milestones", link: "" }
      ]
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
      externalEnrollmentUrl: "https://kidtopia-main-u5x6pj.laravel.cloud/enroll"
    }
  }
};
