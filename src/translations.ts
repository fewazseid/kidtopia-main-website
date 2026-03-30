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
      language: "Language"
    },
    hero: {
      headline: "A Safe, Caring, and Inspiring Place for Your Child to Grow",
      subheadline: "Welcome to Kidtopia International Daycare and Preschool — where children learn, play, and thrive in a secure and nurturing environment.",
      enroll: "Enroll Your Child",
      bookTour: "Book a Tour",
      virtualTour: "Take a Virtual Tour",
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
        { name: "Toddler Program", age: "1.5 – 3 Years", desc: "Focus on communication, behavior development, and social interaction.", btn: "Learn More" },
        { name: "Preschool Program", age: "3 – 5 Years", desc: "Early learning activities that prepare children for school success.", btn: "Learn More" }
      ]
    },
    whyChoose: {
      title: "Why Families Trust Kidtopia",
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
      schedule: "Schedule a Physical Visit"
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
        { name: "Faeza Ebrahim", text: "Kidtopia gives us peace of mind. We receive daily updates and our child loves the environment.", rating: 5 }
      ]
    },
    cta: {
      title: "Give Your Child the Best Start",
      desc: "Join Kidtopia International Daycare and Preschool today.",
      enroll: "Start Enrollment",
      bookTour: "Book a Tour"
    },
    footer: {
      contact: "Contact Information",
      links: "Quick Links",
      resources: "Parent Resources",
      social: "Social Media",
      address: "Kidtopia International Daycare and Preschool, Addis Ababa, Ethiopia",
      phone: "+251 911 000 000",
      email: "info@kidtopia.com"
    },
    leadCapture: {
      title: "Would you like to schedule a tour?",
      book: "Book Tour",
      later: "Later"
    },
    staff: {
      title: "Our Professional Staff",
      members: [
        { name: "Faeza Ebrahim", role: "School Nurse", desc: "Dedicated to the health and well-being of every child at Kidtopia." },
        { name: "Miss Mekdes Alemu", role: "Lead Teacher", desc: "Expert in early childhood education and child development." },
        { name: "Miss Hayat Seid", role: "Caregiver", desc: "Providing a nurturing and supportive environment for our toddlers." },
        { name: "Miss Alemitu Abebe", role: "Preschool Educator", desc: "Preparing our older children for a smooth transition to school." }
      ]
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
      language: "ቋንቋ"
    },
    hero: {
      headline: "ልጅዎ የሚያድግበት ደህንነቱ የተጠበቀ፣ አሳቢ እና አነቃቂ ቦታ",
      subheadline: "ወደ ኪድቶፒያ ዓለም አቀፍ የህፃናት ማቆያ እና ቅድመ ትምህርት ቤት እንኳን በደህና መጡ — ህፃናት ደህንነቱ በተጠበቀ እና በሚንከባከብ አካባቢ የሚማሩበት፣ የሚጫወቱበት እና የሚበለጽጉበት።",
      enroll: "ልጅዎን ያስመዝግቡ",
      bookTour: "ጉብኝት ያስይዙ",
      virtualTour: "ቪርቹዋል ጉብኝት ያድርጉ",
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
        { name: "የታዳጊዎች ፕሮግራም", age: "1.5 – 3 ዓመታት", desc: "በግንኙነት፣ በባህሪ እድገት እና በማህበራዊ መስተጋብር ላይ ያተኩራል።", btn: "ተጨማሪ ይወቁ" },
        { name: "የቅድመ ትምህርት ቤት ፕሮግራም", age: "3 – 5 ዓመታት", desc: "ህፃናትን ለትምህርት ቤት ስኬት የሚያዘጋጁ የቀደመ ትምህርት እንቅስቃሴዎች።", btn: "ተጨማሪ ይወቁ" }
      ]
    },
    whyChoose: {
      title: "ቤተሰቦች ለምን ኪድቶፒያን ያምናሉ",
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
      schedule: "የአካል ጉብኝት ቀጠሮ ይያዙ"
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
        { name: "ፋኢዛ ኢብራሂም", text: "ኪድቶፒያ የአእምሮ ሰላም ይሰጠናል። ዕለታዊ መረጃዎችን እናገኛለን እና ልጃችን አካባቢውን ይወደዋል።", rating: 5 }
      ]
    },
    cta: {
      title: "ለልጅዎ ምርጡን ጅምር ይስጡ",
      desc: "ዛሬ ኪድቶፒያ ዓለም አቀፍ የህፃናት ማቆያ እና ቅድመ ትምህርት ቤትን ይቀላቀሉ።",
      enroll: "ምዝገባ ይጀምሩ",
      bookTour: "ጉብኝት ያስይዙ"
    },
    footer: {
      contact: "የእውቂያ መረጃ",
      links: "ፈጣን አገናኞች",
      resources: "የወላጆች መርጃ",
      social: "ማህበራዊ ሚዲያ",
      address: "ኪድቶፒያ ዓለም አቀፍ የህፃናት ማቆያ እና ቅድመ ትምህርት ቤት፣ አዲስ አበባ፣ ኢትዮጵያ",
      phone: "+251 911 000 000",
      email: "info@kidtopia.com"
    },
    leadCapture: {
      title: "የጉብኝት ቀጠሮ መያዝ ይፈልጋሉ?",
      book: "ጉብኝት ያስይዙ",
      later: "በኋላ"
    },
    staff: {
      title: "የእኛ ፕሮፌሽናል ሰራተኞች",
      members: [
        { name: "ፋኢዛ ኢብራሂም", role: "የትምህርት ቤት ነርስ", desc: "በኪድቶፒያ ለእያንዳንዱ ልጅ ጤና እና ደህንነት የተሰጠች።" },
        { name: "ሚስ መቅደስ አለሙ", role: "ዋና መምህርት", desc: "በቅድመ ልጅነት ትምህርት እና በልጅ እድገት ላይ ባለሙያ።" },
        { name: "ሚስ ሀያት ሰይድ", role: "ተንከባካቢ", desc: "ለታዳጊዎቻችን አሳቢ እና ደጋፊ አካባቢን መስጠት።" },
        { name: "ሚስ አለሚቱ አበበ", role: "የቅድመ ትምህርት ቤት አስተማሪ", desc: "ትላልቅ ልጆቻችንን ወደ ትምህርት ቤት ለስላሳ ሽግግር ማዘጋጀት።" }
      ]
    }
  }
};
