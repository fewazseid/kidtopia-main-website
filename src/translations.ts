export type Language = 'en' | 'am';

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
      parentResources: "Parent Resources"
    },
    hero: {
      headline: "A Safe, Caring, and Inspiring Place for Your Child to Grow",
      subheadline: "Welcome to Kidtopia International Daycare and Preschool — where children learn, play, and thrive in a secure and nurturing environment.",
      enroll: "Enroll Your Child",
      bookTour: "Book a Tour",
      virtualTour: "Take a Virtual Tour",
      heroImage: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2000&auto=format&fit=crop",
      heroVideo: "",
      highlights: [
        { title: "Safe Environment", desc: "Strict health and security protocols" },
        { title: "Qualified Staff", desc: "Trained and carefully selected nannies" },
        { title: "Small Class Sizes", desc: "Personal attention for every child" }
      ]
    },
    safety: {
      title: "Your Child’s Safety is Our Priority",
      cards: [
        { title: "Health Screening", desc: "All children must provide immunization, TB, HIV, and hepatitis screening before enrollment." },
        { title: "Staff Background Verification", desc: "Every Kidtopia staff member undergoes strict recruitment and identity verification." },
        { title: "Secure Check-In and Check-Out", desc: "Our digital system ensures only authorized people can pick up your child." },
        { title: "Clean Environment", desc: "Blankets and daycare materials are cleaned regularly using our internal laundry system." }
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
      image1: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop",
      image2: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop",
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
      image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=1200&h=675&auto=format&fit=crop"
    },
    dailyExperience: {
      title: "A Day at Kidtopia",
      timeline: [
        { time: "Morning", activity: "Welcome and check-in" },
        { time: "Mid-morning", activity: "Learning activities" },
        { time: "Lunch", activity: "Healthy meal time" },
        { time: "Afternoon", activity: "Nap and quiet time" },
        { time: "Late afternoon", activity: "Play and creative activities" },
        { time: "Evening", activity: "Secure parent pickup" }
      ]
    },
    testimonials: {
      title: "What Parents Say",
      list: [
        { 
          name: "Faeza Ebrahim", 
          text: "Kidtopia gives us peace of mind. We receive daily updates and our child loves the environment.", 
          rating: 5, 
          image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop",
          workInfo: "CEO of Arho Technology"
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
        { title: "Parent Handbook", description: "Everything you need to know about our policies, daily schedules, and what to expect.", type: "PDF Document" },
        { title: "Enrollment Forms", description: "Download and print the necessary forms to begin the enrollment process.", type: "PDF Forms" },
        { title: "Educational Activities", description: "Fun and educational activities you can do with your child at home.", type: "Video Series" },
        { title: "Nutrition Guide", description: "Learn about our healthy meal plans and get tips for nutritious eating at home.", type: "Guide" }
      ]
    },
    leadCapture: {
      title: "Would you like to schedule a tour?",
      book: "Book Tour",
      later: "Later"
    },
    staff: {
      title: "Our Professional Staff",
      members: [
        { name: "Faeza Ebrahim", role: "School Nurse", desc: "Dedicated to the health and well-being of every child at Kidtopia.", image: "https://picsum.photos/seed/nurse-faeza/600/800" },
        { name: "Miss Mekdes Alemu", role: "Lead Teacher", desc: "Expert in early childhood education and child development.", image: "https://picsum.photos/seed/teacher-mekdes/600/800" },
        { name: "Miss Hayat Seid", role: "Caregiver", desc: "Providing a nurturing and supportive environment for our toddlers.", image: "https://picsum.photos/seed/caregiver-hayat/600/800" },
        { name: "Miss Alemitu Abebe", role: "Preschool Educator", desc: "Preparing our older children for a smooth transition to school.", image: "https://picsum.photos/seed/educator-alemitu/600/800" }
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
      parentResources: "የወላጆች መርጃ"
    },
    hero: {
      headline: "ልጅዎ የሚያድግበት ደህንነቱ የተጠበቀ፣ አሳቢ እና አነቃቂ ቦታ",
      subheadline: "ወደ ኪድቶፒያ ዓለም አቀፍ የህፃናት ማቆያ እና ቅድመ ትምህርት ቤት እንኳን በደህና መጡ — ህፃናት ደህንነቱ በተጠበቀ እና በሚንከባከብ አካባቢ የሚማሩበት፣ የሚጫወቱበት እና የሚበለጽጉበት።",
      enroll: "ልጅዎን ያስመዝግቡ",
      bookTour: "ጉብኝት ያስይዙ",
      virtualTour: "ቪርቹዋል ጉብኝት ያድርጉ",
      heroImage: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2000&auto=format&fit=crop",
      heroVideo: "",
      highlights: [
        { title: "ደህንነቱ የተጠበቀ አካባቢ", desc: "ጥብቅ የጤና እና የደህንነት ፕሮቶኮሎች" },
        { title: "ብቁ ሰራተኞች", desc: "የሰለጠኑ እና በጥንቃቄ የተመረጡ ሞግዚቶች" },
        { title: "አነስተኛ የክፍል መጠኖች", desc: "ለእያንዳንዱ ልጅ የግል ትኩረት" }
      ]
    },
    safety: {
      title: "የልጅዎ ደህንነት ቅድሚያ የምንሰጠው ጉዳይ ነው",
      cards: [
        { title: "የጤና ምርመራ", desc: "ሁሉም ህፃናት ከመመዝገባቸው በፊት የክትባት፣ የቲቢ፣ የኤችአይቪ እና የሄፓታይተስ ምርመራ ማቅረብ አለባቸው።" },
        { title: "የሰራተኞች ዳራ ማረጋገጫ", desc: "እያንዳንዱ የኪድቶፒያ ሰራተኛ ጥብቅ የቅጥር እና የማንነት ማረጋገጫ ይደረግለታል።" },
        { title: "ደህንነቱ የተጠበቀ መግቢያ እና መውጫ", desc: "የእኛ ዲጂታል ስርዓት የተፈቀደላቸው ሰዎች ብቻ ልጅዎን መውሰድ እንደሚችሉ ያረጋግጣል።" },
        { title: "ንጹህ አካባቢ", desc: "ብርድ ልብሶች እና የቀን እንክብካቤ ቁሳቁሶች በውስጣዊ የልብስ ማጠቢያ ስርዓታችን በየጊዜው ይጸዳሉ።" }
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
      image1: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop",
      image2: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop",
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
      image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=1200&h=675&auto=format&fit=crop"
    },
    dailyExperience: {
      title: "አንድ ቀን በኪድቶፒያ",
      timeline: [
        { time: "ጥዋት", activity: "እንኳን ደህና መጡ እና መግቢያ" },
        { time: "ረፋድ", activity: "የመማሪያ እንቅስቃሴዎች" },
        { time: "ምሳ", activity: "ጤናማ የምግብ ሰዓት" },
        { time: "ከሰዓት", activity: "የእንቅልፍ እና የጸጥታ ሰዓት" },
        { time: "ከሰዓት በኋላ", activity: "መጫወት እና የፈጠራ ስራዎች" },
        { time: "ምሽት", activity: "ደህንነቱ የተጠበቀ የወላጅ መረከቢያ" }
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
        { title: "የወላጅ መመሪያ", description: "ስለ ፖሊሲዎቻችን፣ ዕለታዊ የጊዜ ሰሌዳዎች እና ምን እንደሚጠብቁ ማወቅ ያለብዎት ነገር ሁሉ።", type: "PDF ሰነድ" },
        { title: "የምዝገባ ቅጾች", description: "የምዝገባ ሂደቱን ለመጀመር አስፈላጊዎቹን ቅጾች ያውርዱ እና ያትሙ።", type: "PDF ቅጾች" },
        { title: "ትምህርታዊ እንቅስቃሴዎች", description: "ከቤትዎ ከልጅዎ ጋር ሊያደርጓቸው የሚችሏቸው አስደሳች እና ትምህርታዊ እንቅስቃሴዎች።", type: "የቪዲዮ ተከታታይ" },
        { title: "የተመጣጠነ ምግብ መመሪያ", description: "ስለ ጤናማ የምግብ እቅዶቻችን ይወቁ እና በቤት ውስጥ ለተመጣጠነ ምግብ ጠቃሚ ምክሮችን ያግኙ።", type: "መመሪያ" }
      ]
    },
    leadCapture: {
      title: "የጉብኝት ቀጠሮ መያዝ ይፈልጋሉ?",
      book: "ጉብኝት ያስይዙ",
      later: "በኋላ"
    },
    staff: {
      title: "የእኛ ፕሮፌሽናል ሰራተኞች",
      members: [
        { name: "ፋኢዛ ኢብራሂም", role: "የትምህርት ቤት ነርስ", desc: "በኪድቶፒያ ለእያንዳንዱ ልጅ ጤና እና ደህንነት የተሰጠች።", image: "https://picsum.photos/seed/nurse-faeza/600/800" },
        { name: "ሚስ መቅደስ አለሙ", role: "ዋና መምህርት", desc: "በቅድመ ልጅነት ትምህርት እና በልጅ እድገት ላይ ባለሙያ።", image: "https://picsum.photos/seed/teacher-mekdes/600/800" },
        { name: "ሚስ ሀያት ሰይድ", role: "ተንከባካቢ", desc: "ለታዳጊዎቻችን አሳቢ እና ደጋፊ አካባቢን መስጠት።", image: "https://picsum.photos/seed/caregiver-hayat/600/800" },
        { name: "ሚስ አለሚቱ አበበ", role: "የቅድመ ትምህርት ቤት አስተማሪ", desc: "ትላልቅ ልጆቻችንን ወደ ትምህርት ቤት ለስላሳ ሽግግር ማዘጋጀት።", image: "https://picsum.photos/seed/educator-alemitu/600/800" }
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
    }
  }
};
