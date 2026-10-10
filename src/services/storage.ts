import {
  Wing,
  Expert,
  Slider,
  Notice,
  EventItem,
  GalleryAlbum,
  CareerApplication,
  ContactEnquiry,
  AdminUser,
  ActivityLog,
  SiteSettings,
} from '../types';
import { supabase, SUPABASE_TABLES } from './supabaseClient';

const STORAGE_KEYS = {
  WINGS: 'vvt_wings_data',
  EXPERTS: 'vvt_experts_data',
  SLIDERS: 'vvt_sliders_data',
  NOTICES: 'vvt_notices_data',
  EVENTS: 'vvt_events_data',
  GALLERY: 'vvt_gallery_data',
  APPLICATIONS: 'vvt_applications_data',
  ENQUIRIES: 'vvt_enquiries_data',
  ADMINS: 'vvt_admins_data',
  LOGS: 'vvt_activity_logs_data',
  SETTINGS: 'vvt_site_settings_data',
  CURRENT_ADMIN: 'vvt_current_admin_session',
};

// Seed initial Wings
const initialWings: Wing[] = [
  {
    id: 'wing-vvdc',
    slug: 'vvdc',
    name: 'VISHWA VINAYAK DEGREE COLLEGE',
    shortName: 'VVDC',
    tagline: 'Empowering Higher Education, Character & Future Leadership',
    coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1400&q=80',
    description:
      'Vishwa Vinayak Degree College is a premier higher educational institution offering comprehensive undergraduate programs in Science, Arts, and Commerce under Vishwa Vinayak Trust.',
    aboutText:
      'Established to serve the higher educational aspirations of rural and semi-urban students of Kendujhar district, Vishwa Vinayak Degree College (VVDC) provides modern education anchored in values. With state-of-the-art laboratories, a digital library, dedicated faculty, and career guidance cell, VVDC prepares students for competitive examinations, research, and professional careers.',
    address: 'At/Po-Khireitangiri, Dist-Kendujhar, State-Odisha, PIN-758046',
    phone: '+91 9437238689',
    email: 'vvdc.khireitangiri@vvt.edu.in',
    website: 'https://vvdc.vvt.edu.in',
    facebook: 'https://facebook.com/vvt.vvdc',
    instagram: 'https://instagram.com/vvt_vvdc',
    principalName: 'Dr. Ramesh Chandra Mahanta',
    principalQualification: 'M.Sc., Ph.D. in Physics, 22+ Years in Academic Administration',
    principalMessage:
      'At Vishwa Vinayak Degree College, our mission is to make quality higher education accessible to all deserving minds in Northern Odisha. We foster critical thinking, academic rigor, and civic responsibility.',
    principalPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    establishedYear: 2012,
    affiliation: 'Affiliated to North Orissa University / Dharanidhar University & UGC Recognized',
    campusArea: '12 Acres Green Campus',
    studentCount: 850,
    facultyCount: 38,
    courses: [
      {
        id: 'c1',
        name: '+3 Science (B.Sc. Honours)',
        duration: '3 Years (6 Semesters)',
        eligibility: '+2 Science with minimum 45% aggregate',
        seats: 128,
        description: 'Honours streams in Physics, Chemistry, Mathematics, Botany, and Zoology with modern practical laboratories.',
        streams: ['Physics', 'Chemistry', 'Mathematics', 'Botany', 'Zoology'],
      },
      {
        id: 'c2',
        name: '+3 Arts (B.A. Honours)',
        duration: '3 Years (6 Semesters)',
        eligibility: '+2 Arts/Science/Commerce with minimum 40% aggregate',
        seats: 192,
        description: 'Honours streams in Odia, English, History, Political Science, Economics, and Education.',
        streams: ['Odia', 'English', 'History', 'Political Science', 'Economics', 'Education'],
      },
      {
        id: 'c3',
        name: '+3 Commerce (B.Com. Honours)',
        duration: '3 Years (6 Semesters)',
        eligibility: '+2 Commerce or equivalent',
        seats: 64,
        description: 'Accounting, Finance, Business Law, GST compliance, and computerized accounting training with Tally ERP.',
        streams: ['Accounting & Finance', 'Management'],
      },
    ],
    facilities: [
      'Well-equipped Science Laboratories (Physics, Chem, Bio)',
      'High-Speed Wi-Fi Enabled Computer Lab with 50+ PCs',
      'Central Library with over 15,000 Textbooks & Reference Journals',
      'Spacious Seminar Hall & Smart Audio-Visual Classrooms',
      'Separate Safe & Secure Hostels for Boys and Girls',
      'Playground for Cricket, Football, Volleyball & Athletics',
      'Dedicated College Bus Transportation across Kendujhar routes',
      'Career Counseling & Competitive Exam Coaching Cell',
    ],
    admissionInfo:
      'Admissions are processed through the Student Academic Management System (SAMS Odisha) as well as offline institutional guidance desk at Khireitangiri campus.',
    status: 'active',
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'wing-vvhss',
    slug: 'vvhss',
    name: 'VISHWA VINAYAK HIGHER SECONDARY SCHOOL',
    shortName: 'VVHSS',
    tagline: 'Building Strong Foundations for Higher Learning & Character',
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=80',
    description:
      'Vishwa Vinayak Higher Secondary School provides comprehensive +2 education in Science, Arts, and Commerce with special coaching for competitive exams like NEET, JEE, and OUAT.',
    aboutText:
      'Vishwa Vinayak Higher Secondary School (VVHSS), Khireitangiri, is recognized by the Govt. of Odisha and affiliated to the Council of Higher Secondary Education (CHSE), Odisha. We bridge the transition between high school and tertiary education through disciplined pedagogy, individual mentoring, regular mock tests, and hostel study routines.',
    address: 'At/Po-Khireitangiri, Dist-Kendujhar, State-Odisha, PIN-758046',
    phone: '+91 9437614185',
    email: 'vvhss.khireitangiri@vvt.edu.in',
    website: 'https://vvhss.vvt.edu.in',
    facebook: 'https://facebook.com/vvt.vvhss',
    instagram: 'https://instagram.com/vvt_vvhss',
    principalName: 'Prof. Subhashree Mohanty',
    principalQualification: 'M.A., M.Ed., M.Phil., 18+ Years Experience in Higher Secondary Pedagogy',
    principalMessage:
      'The crucial +2 years shape a student’s lifelong destiny. At VVHSS, we blend academic discipline with loving mentorship to help every child unlock their fullest potential.',
    principalPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80',
    establishedYear: 2008,
    affiliation: 'Recognized by Govt. of Odisha & Affiliated to CHSE Odisha',
    campusArea: 'Co-located at Vishwa Vinayak Campus',
    studentCount: 620,
    facultyCount: 28,
    courses: [
      {
        id: 'h1',
        name: '+2 Science (CHSE Odisha)',
        duration: '2 Years',
        eligibility: 'Pass in 10th / Matriculation (BSE Odisha / CBSE / ICSE)',
        seats: 128,
        description: 'Physics, Chemistry, Mathematics, Biology, IT / PCMB combinations with integrated coaching for NEET & JEE.',
        streams: ['PCMB', 'PCMC', 'PCMIT'],
      },
      {
        id: 'h2',
        name: '+2 Arts (CHSE Odisha)',
        duration: '2 Years',
        eligibility: 'Pass in 10th / Matriculation with passing marks in English and MIL',
        seats: 128,
        description: 'History, Political Science, Economics, Education, Odia, Logic, and Sanskrit.',
        streams: ['General Arts', 'Social Sciences'],
      },
      {
        id: 'h3',
        name: '+2 Commerce (CHSE Odisha)',
        duration: '2 Years',
        eligibility: 'Pass in 10th / Matriculation',
        seats: 64,
        description: 'Accountancy, Business Studies, Commercial Mathematics, and Banking.',
        streams: ['Commerce Core'],
      },
    ],
    facilities: [
      'Integrated Science Labs designed as per CHSE curriculum',
      'Daily 2-hour Supervised Evening Study Hours in Hostels',
      'Weekly Unit Tests & Bi-Monthly Evaluation System',
      'Hostel facility with nutritious home-style vegetarian & non-veg food',
      'Remedial doubt-clearing classes for weaker students',
      'Special foundation classes for NEET/JEE entrance tests',
      'Safe transport bus service covering all panchayats of Kendujhar',
    ],
    admissionInfo:
      'Admissions conducted through e-Admission SAMS Odisha portal. Direct application & institutional counseling available on campus.',
    status: 'active',
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z',
  },
];

// Seed Home Sliders
const initialSliders: Slider[] = [
  {
    id: 'slider-1',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=85',
    heading: 'VISHWA VINAYAK TRUST GROUP OF INSTITUTIONS',
    subheading: 'Nurturing Academic Excellence, Values & Future Leadership in Odisha',
    description:
      'Premier educational trust at Khireitangiri, Kendujhar offering holistic education from higher secondary schooling to advanced degree graduation with dedicated mentors and modern infrastructure.',
    buttonText: 'Explore Our Wings',
    buttonUrl: '/wings',
    order: 1,
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'slider-2',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=85',
    heading: 'VISHWA VINAYAK DEGREE COLLEGE (VVDC)',
    subheading: '+3 Science, Arts & Commerce Honours Degree Programs',
    description:
      'State-of-the-art laboratories, modern library, renowned faculty, and vibrant campus life. Empowering youth with market-ready education and academic brilliance.',
    buttonText: 'View Degree College',
    buttonUrl: '/wings/vvdc',
    order: 2,
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'slider-3',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=85',
    heading: 'VISHWA VINAYAK HIGHER SECONDARY SCHOOL (VVHSS)',
    subheading: '+2 Science, Arts & Commerce Affiliated to CHSE Odisha',
    description:
      'Building solid foundations with disciplined study hours, dedicated entrance test preparation (NEET/JEE), secure hostel facilities, and personalized student mentoring.',
    buttonText: 'View Higher Secondary',
    buttonUrl: '/wings/vvhss',
    order: 3,
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'slider-4',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=85',
    heading: 'ADMISSIONS OPEN FOR ACADEMIC YEAR 2026-27',
    subheading: 'Scholarships & Concessions Available for Meritorious & Rural Students',
    description:
      'Secure your seat in Odisha’s trusted institution. Hostel & bus facilities available. Dedicated career coaching and holistic personality development.',
    buttonText: 'Apply For Admission',
    buttonUrl: '/contact',
    order: 4,
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
];

// Seed Notices
const initialNotices: Notice[] = [
  {
    id: 'not-1',
    title: 'Admissions Open for Academic Session 2026-27 (+2 & +3 Degree Programs)',
    noticeDate: '2026-03-25',
    category: 'Admission',
    shortDescription:
      'Online and offline application window is now open for admission into +2 Science, Arts, Commerce at VVHSS and +3 Honours degree programs at VVDC.',
    fullContent:
      'This is to notify all prospective students, parents, and guardians that admissions for the upcoming academic session 2026-27 have commenced. Students can submit application forms at the central administrative office at Khireitangiri, Kendujhar or through SAMS Odisha portal. Special fee concessions and merit scholarships will be awarded to top scorers in 10th and 12th board exams.',
    attachmentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    attachmentName: 'Admission_Brochure_2026_27.pdf',
    attachmentType: 'pdf',
    attachmentSize: '1.8 MB',
    isImportant: true,
    isNew: true,
    wingId: 'all',
    status: 'published',
    createdBy: 'Principal VVDC',
    createdAt: '2026-03-25T09:00:00.000Z',
  },
  {
    id: 'not-2',
    title: 'Notice Regarding 6th Semester Degree Practical Examinations 2026',
    noticeDate: '2026-03-20',
    category: 'Examination',
    shortDescription:
      'Practical exam schedule for Physics, Chemistry, Botany, and Zoology Honours students of Vishwa Vinayak Degree College.',
    fullContent:
      'All final year +3 Science Honours students of Vishwa Vinayak Degree College are hereby informed that the 6th Semester Practical Examination will be conducted from April 10, 2026 to April 16, 2026. Detailed batch allotments and laboratory schedules have been posted on the college department notice board. Strict adherence to lab coats and practical record submission is compulsory.',
    attachmentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    attachmentName: '6th_Sem_Practical_Schedule_VVDC.pdf',
    attachmentType: 'pdf',
    attachmentSize: '420 KB',
    isImportant: true,
    isNew: true,
    wingId: 'wing-vvdc',
    status: 'published',
    createdBy: 'Examination Controller',
    createdAt: '2026-03-20T10:30:00.000Z',
  },
  {
    id: 'not-3',
    title: 'Walk-in Interview for Lecturer Positions in Physics, Mathematics & English',
    noticeDate: '2026-03-15',
    category: 'Recruitment',
    shortDescription:
      'Vishwa Vinayak Trust invites dynamic candidates for teaching faculty positions at VVDC & VVHSS.',
    fullContent:
      'Applications are invited from eligible candidates with Master’s degree (minimum 55% marks) in Physics, Mathematics, English, and Odia for faculty positions. Experienced and NET/GATE qualified candidates will be given preference. Candidates can also submit their CV through the Trust Career Portal on this website.',
    attachmentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    attachmentName: 'Faculty_Recruitment_Notification_2026.pdf',
    attachmentType: 'pdf',
    attachmentSize: '310 KB',
    isImportant: false,
    isNew: true,
    wingId: 'all',
    status: 'published',
    createdBy: 'Trust Secretary',
    createdAt: '2026-03-15T11:00:00.000Z',
  },
  {
    id: 'not-4',
    title: 'CHSE Odisha Annual Higher Secondary Exam Preparatory Doubt Clearing Schedule',
    noticeDate: '2026-03-10',
    category: 'Academic',
    shortDescription:
      'Mandatory special doubt-clearing sessions for +2 Science & Arts students at VVHSS campus.',
    fullContent:
      'To ensure top performance in upcoming CHSE examinations, daily 2-hour doubt clearing and formula revision sessions will be conducted from 4:00 PM to 6:00 PM in the auditorium. All residential and day-scholar students are required to attend with their respective subject notes.',
    attachmentUrl: '',
    attachmentName: '',
    attachmentType: 'none',
    isImportant: false,
    isNew: false,
    wingId: 'wing-vvhss',
    status: 'published',
    createdBy: 'Principal VVHSS',
    createdAt: '2026-03-10T08:00:00.000Z',
  },
  {
    id: 'not-5',
    title: 'Notification for Annual Sports & Athletic Meet 2026',
    noticeDate: '2026-03-02',
    category: 'General',
    shortDescription:
      'Inter-wing athletics, cricket, volleyball, and badminton tournament to be held on central playground.',
    fullContent:
      'The Annual Sports Week of Vishwa Vinayak Trust Group of Institutions will take place from April 2nd to April 4th, 2026. Students interested in track events, volleyball, cricket, and carrom must submit their names to the Physical Education Director Mr. B. K. Jena on or before March 29, 2026.',
    attachmentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    attachmentName: 'Sports_Events_List_and_Rules.pdf',
    attachmentType: 'pdf',
    attachmentSize: '512 KB',
    isImportant: false,
    isNew: false,
    wingId: 'all',
    status: 'published',
    createdBy: 'Sports Committee',
    createdAt: '2026-03-02T14:00:00.000Z',
  },
];

// Seed Events
const initialEvents: EventItem[] = [
  {
    id: 'evt-1',
    title: 'VINAYAKOTSAV 2026 - Annual Cultural & Academic Fest',
    eventDate: '2026-04-18',
    endDate: '2026-04-20',
    startTime: '09:30 AM',
    endTime: '08:30 PM',
    venue: 'Vishwa Vinayak Central Auditorium, Khireitangiri Campus',
    wingId: 'all',
    description:
      'A 3-day grand festival celebrating student talent, folk & classical dances of Odisha, drama, science exhibitions, and prize distribution.',
    fullContent:
      'Vinayakotsav is the flagship annual cultural confluence of Vishwa Vinayak Trust Group of Institutions. Featuring inter-college debates, quizzes, Sambalpuri and Odissi dance performances, modern musical bands, and an academic excellence awards ceremony honoring toppers of VVDC and VVHSS. Dignitaries from Kendujhar district administration and education department will grace the valedictory session.',
    registrationUrl: 'https://vvt.edu.in/vinayakotsav-register',
    status: 'upcoming',
    coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    ],
    documents: [
      { name: 'Vinayakotsav_Schedule.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    ],
    isPublished: true,
    createdAt: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'evt-2',
    title: 'Mega Science Exhibition & Renewable Energy Working Model Fair',
    eventDate: '2026-04-05',
    startTime: '10:00 AM',
    endTime: '04:00 PM',
    venue: 'VVDC Science Block, Khireitangiri',
    wingId: 'wing-vvdc',
    description:
      'Inter-college science showcase by students demonstrating solar innovations, water purification units, and automated robotics.',
    fullContent:
      'Organized by the Department of Physics and Chemistry of Vishwa Vinayak Degree College. Students from over 15 schools and colleges across Kendujhar district will exhibit over 60 working scientific projects evaluated by guest scientists and university professors.',
    registrationUrl: '',
    status: 'upcoming',
    coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
    images: [],
    isPublished: true,
    createdAt: '2026-02-28T00:00:00.000Z',
  },
  {
    id: 'evt-3',
    title: 'Free Rural Health, Eye Check-up & Blood Donation Camp',
    eventDate: '2026-03-12',
    startTime: '09:00 AM',
    endTime: '03:00 PM',
    venue: 'Trust Health Center, Khireitangiri',
    wingId: 'all',
    description:
      'Vishwa Vinayak Social Welfare Initiative in association with District Red Cross Society Kendujhar.',
    fullContent:
      'Over 250 blood units were collected and 400+ villagers received free medical consultation, eye tests, and essential medicines from specialist doctors.',
    status: 'completed',
    coverImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    images: [],
    isPublished: true,
    createdAt: '2026-02-15T00:00:00.000Z',
  },
  {
    id: 'evt-4',
    title: 'Grand Ganesh Chaturthi Mahotsav & Trust Foundation Celebrations',
    eventDate: '2025-09-07',
    startTime: '08:00 AM',
    endTime: '09:00 PM',
    venue: 'Central Temple Lawn, Vishwa Vinayak Campus',
    wingId: 'all',
    description:
      'Annual auspicious invocation of Lord Vinayak with Havana, Vedic chanting, Prasad Seva, and community feast for 5,000 devotees.',
    fullContent:
      'As our patron deity Lord Vishwa Vinayak, the Ganesh Puja is celebrated with immense devotion and grandeur across all wings of the trust.',
    status: 'completed',
    coverImage: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80',
    images: [],
    isPublished: true,
    createdAt: '2025-08-20T00:00:00.000Z',
  },
];

// Seed Gallery Albums
const initialAlbums: GalleryAlbum[] = [
  {
    id: 'alb-1',
    title: 'Campus Infrastructure & Academic Facilities',
    wingId: 'all',
    category: 'Campus',
    coverPhoto: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    description: 'Serene academic blocks, lush green lawns, digital library, and lecture halls at Khireitangiri.',
    isPublished: true,
    createdAt: '2026-01-10T00:00:00.000Z',
    photos: [
      {
        id: 'p1',
        url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
        caption: 'Main Academic Building & Administrative Wing, Khireitangiri',
        category: 'Campus',
      },
      {
        id: 'p2',
        url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
        caption: 'Central Digital Library with over 15,000 academic titles',
        category: 'Campus',
      },
      {
        id: 'p3',
        url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
        caption: 'Vishwa Vinayak Higher Secondary Block',
        category: 'VVHSS',
      },
      {
        id: 'p4',
        url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80',
        caption: 'High-tech Computer Center with modern high-speed terminals',
        category: 'Campus',
      },
    ],
  },
  {
    id: 'alb-2',
    title: 'Science Laboratories & Hands-on Learning',
    wingId: 'wing-vvdc',
    category: 'VVDC',
    coverPhoto: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    description: 'Practical sessions in Physics, Chemistry, Botany, and Zoology at VVDC.',
    isPublished: true,
    createdAt: '2026-01-15T00:00:00.000Z',
    photos: [
      {
        id: 'p5',
        url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
        caption: 'Physics Optics and Wave Mechanics Laboratory',
        category: 'VVDC',
      },
      {
        id: 'p6',
        url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80',
        caption: 'Chemistry Analytical Lab with specialized glassware and reagents',
        category: 'VVDC',
      },
      {
        id: 'p7',
        url: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1200&q=80',
        caption: 'Botany & Plant Science Research Demonstration',
        category: 'VVDC',
      },
    ],
  },
  {
    id: 'alb-3',
    title: 'Cultural Celebrations & Vinayakotsav',
    wingId: 'all',
    category: 'Functions',
    coverPhoto: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    description: 'Vibrant cultural traditions, folk music, dance dramas, and student talent showcases.',
    isPublished: true,
    createdAt: '2026-02-01T00:00:00.000Z',
    photos: [
      {
        id: 'p8',
        url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
        caption: 'Annual Fest Stage Performances and Light Display',
        category: 'Functions',
      },
      {
        id: 'p9',
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
        caption: 'Folk Dance Troupe presenting Odissi and Sambalpuri art forms',
        category: 'Events',
      },
      {
        id: 'p10',
        url: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80',
        caption: 'Traditional Ganesh Puja Celebrations on Campus',
        category: 'Trust',
      },
    ],
  },
  {
    id: 'alb-4',
    title: 'Sports, Athletics & Youth Development',
    wingId: 'all',
    category: 'Achievements',
    coverPhoto: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    description: 'Annual athletic meets, volleyball championships, cricket matches, and trophy ceremonies.',
    isPublished: true,
    createdAt: '2026-02-10T00:00:00.000Z',
    photos: [
      {
        id: 'p11',
        url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
        caption: 'Track & Field Sprint Championship at College Grounds',
        category: 'Achievements',
      },
      {
        id: 'p12',
        url: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1200&q=80',
        caption: 'District Level Trophy Award Ceremony for VVDC Volleyball Team',
        category: 'Achievements',
      },
    ],
  },
];

// Seed Career Applications
const initialApplications: CareerApplication[] = [
  {
    id: 'app-1',
    applicationId: 'VVTI-2026-000001',
    fullName: 'Prasant Kumar Sahoo',
    parentName: 'Baidhar Sahoo',
    dob: '1995-06-14',
    gender: 'Male',
    mobile: '9861234567',
    email: 'prasant.sahoo@example.com',
    address: 'At-Ghatgaon, Dist-Kendujhar, Odisha - 758027',
    qualification: 'M.Sc. in Physics (Utkal University), B.Ed.',
    experience: '4 Years as Lecturer in Higher Secondary College',
    skills: 'Optics, Electronics, Python for Science, Lab Management',
    applyingFor: 'Lecturer in Physics',
    preferredWingId: 'wing-vvdc',
    message: 'I am deeply enthusiastic to teach higher secondary and degree students at Vishwa Vinayak Trust.',
    cvFileName: 'Prasant_Sahoo_Physics_CV.pdf',
    cvFileType: 'application/pdf',
    cvFileSize: '480 KB',
    status: 'shortlisted',
    adminRemarks: 'Strong academic record. Call for interview in 2nd week of April.',
    createdAt: '2026-03-22T10:15:00.000Z',
    updatedAt: '2026-03-24T12:00:00.000Z',
  },
  {
    id: 'app-2',
    applicationId: 'VVTI-2026-000002',
    fullName: 'Sunita Priyadarshini Mohapatra',
    parentName: 'Niranjan Mohapatra',
    dob: '1997-11-20',
    gender: 'Female',
    mobile: '9438901234',
    email: 'sunita.mohapatra@example.com',
    address: 'At-Anandapur, Dist-Kendujhar, Odisha - 758021',
    qualification: 'M.A. in English (Ravenshaw University), UGC-NET Qualified',
    experience: '2 Years in Degree College Teaching',
    skills: 'British Literature, Communicative English, Soft Skills, Debate Coach',
    applyingFor: 'Lecturer in English',
    preferredWingId: 'wing-vvhss',
    message: 'Seeking an opportunity to foster communicative fluency and literary appreciation in rural students.',
    cvFileName: 'Sunita_Mohapatra_English_Resume.docx',
    cvFileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    cvFileSize: '320 KB',
    status: 'under_review',
    adminRemarks: 'Credentials verified against UGC-NET roll.',
    createdAt: '2026-03-24T14:40:00.000Z',
    updatedAt: '2026-03-24T14:40:00.000Z',
  },
  {
    id: 'app-3',
    applicationId: 'VVTI-2026-000003',
    fullName: 'Debabrata Nayak',
    parentName: 'Gopinath Nayak',
    dob: '1998-03-08',
    gender: 'Male',
    mobile: '9777123987',
    email: 'debabrata.nayak@example.com',
    address: 'At-Khireitangiri, Dist-Kendujhar, Odisha - 758046',
    qualification: 'MCA, B.Sc. (Computer Science)',
    experience: '3 Years as Systems Administrator & Lab Assistant',
    skills: 'Linux, Networking, Windows Server, C++, Java, Web Design',
    applyingFor: 'Computer Lab Administrator / IT Assistant',
    preferredWingId: 'all',
    message: 'Local resident of Khireitangiri, ready to provide dedicated support to college computer centers.',
    cvFileName: 'Debabrata_Nayak_MCA_CV.pdf',
    cvFileType: 'application/pdf',
    cvFileSize: '610 KB',
    status: 'new',
    adminRemarks: '',
    createdAt: '2026-03-27T09:20:00.000Z',
    updatedAt: '2026-03-27T09:20:00.000Z',
  },
];

// Seed Contact Enquiries
const initialEnquiries: ContactEnquiry[] = [
  {
    id: 'enq-1',
    name: 'Binod Bihari Rout',
    mobile: '9437112233',
    email: 'binod.rout@gmail.com',
    subject: 'Enquiry for +2 Science Admission & Boys Hostel Facility',
    message:
      'My son is completing his 10th matriculation this year from Keonjhar town. We would like details on the residential hostel, fooding, and integrated NEET coaching fees at VVHSS.',
    status: 'read',
    replyNotes: 'Contacted over phone on 26 March. Shared brochure and invited to visit Khireitangiri campus.',
    createdAt: '2026-03-25T11:20:00.000Z',
  },
  {
    id: 'enq-2',
    name: 'Manoranjan Das',
    mobile: '9861554433',
    email: 'manoranjan.das@outlook.com',
    subject: '+3 B.Sc. Zoology Honours Seats & Laboratory Facilities',
    message:
      'I want to inquire regarding the total intake capacity in B.Sc. Zoology Honours at Vishwa Vinayak Degree College and hostel availability for girl students.',
    status: 'unread',
    createdAt: '2026-03-27T16:45:00.000Z',
  },
];

// Seed Administrators
// Super Admin: admin@vvt.org.in / admin123
const initialAdmins: AdminUser[] = [
  {
    id: 'adm-1',
    fullName: 'Mr. Rabinarayana Mohanta (Trust Chairman)',
    email: 'admin@vvt.org.in',
    mobile: '+91 9437238689',
    role: 'super_admin',
    status: 'active',
    passwordHash: 'admin123', // In demo storage, plain hash/simulated
    lastLogin: '2026-03-28T07:15:00.000Z',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'adm-2',
    fullName: 'Academic Coordinator',
    email: 'coordinator@vvt.edu.in',
    mobile: '+91 9437614185',
    role: 'admin',
    status: 'active',
    passwordHash: 'admin123',
    lastLogin: '2026-03-26T14:30:00.000Z',
    createdAt: '2024-02-01T00:00:00.000Z',
  },
  {
    id: 'adm-3',
    fullName: 'Office Editor',
    email: 'editor@vvt.edu.in',
    mobile: '+91 9437000000',
    role: 'editor',
    status: 'active',
    passwordHash: 'admin123',
    lastLogin: '2026-03-20T10:00:00.000Z',
    createdAt: '2024-03-01T00:00:00.000Z',
  },
];

// Initial Site Settings
const initialSettings: SiteSettings = {
  institutionName: 'VISHWA VINAYAK TRUST GROUP OF INSTITUTIONS',
  tagline: 'Illuminating Minds, Empowering Futures with Holistic Education',
  addressLine1: 'At/Po-Khireitangiri',
  addressLine2: 'Dist-Kendujhar',
  district: 'Kendujhar',
  state: 'Odisha',
  pin: '758046',
  country: 'India',
  phones: ['+91 9437238689', '+91 9437614185'],
  email: 'vishwavinayaktrust@gmail.com',
  officeHours: 'Monday - Saturday: 8:00 AM to 5:00 PM (Closed on Sundays & Public Holidays)',
  welcomeHeading: 'WELCOME TO VISHWA VINAYAK TRUST GROUP OF INSTITUTIONS',
  welcomeSubheading: 'A Legacy of Educational Empowerment in Khireitangiri, Kendujhar',
  welcomeText:
    'Vishwa Vinayak Trust was founded with the sacred vision of transforming the educational landscape of rural and northern Odisha. Today, our group of institutions—including Vishwa Vinayak Degree College (VVDC) and Vishwa Vinayak Higher Secondary School (VVHSS)—stands as a beacon of academic excellence, ethical discipline, and modern infrastructure. We blend rigorous academic training with holistic personality development, empowering thousands of youth to achieve their highest aspirations.',
  trustHistory:
    'Established under the guidance of visionary educators and social leaders of Kendujhar, Vishwa Vinayak Trust was conceived to eliminate the geographical barrier for quality higher education. Over the years, the trust has nurtured thousands of graduates, researchers, teachers, and professionals who serve across India and abroad.',
  mission:
    'To provide high-quality, value-based, accessible education that nurtures intellectual curiosity, social consciousness, and career competence among students of all backgrounds.',
  vision:
    'To emerge as Northern Odisha’s most trusted, innovative, and multidisciplinary educational ecosystem that bridges rural talent with global opportunities.',
  socialLinks: {
    facebook: 'https://facebook.com/vishwavinayaktrust',
    instagram: 'https://instagram.com/vishwavinayaktrust',
    youtube: 'https://youtube.com/@vishwavinayaktrust',
    twitter: 'https://twitter.com/vvt_institutes',
    linkedin: 'https://linkedin.com/company/vishwa-vinayak-trust',
  },
  seo: {
    pageTitle: 'Vishwa Vinayak Trust Group of Institutions | Khireitangiri, Kendujhar, Odisha',
    metaDescription:
      'Official portal of Vishwa Vinayak Trust Group of Institutions, Khireitangiri, Kendujhar. Home of VVDC & VVHSS offering +2 & +3 Degree courses in Science, Arts & Commerce.',
    metaKeywords:
      'Vishwa Vinayak Trust, VVDC, VVHSS, Degree College Kendujhar, Higher Secondary School Khireitangiri, CHSE Odisha, SAMS Odisha, Keonjhar colleges',
    ogTitle: 'Vishwa Vinayak Trust Group of Institutions, Khireitangiri',
    ogDescription:
      'Empowering higher education and character building. Explore academic wings, admissions, notices, events, and job opportunities.',
  },
};

const initialLogs: ActivityLog[] = [
  {
    id: 'log-1',
    adminName: 'Mr. Rabinarayana Mohanta (Trust Chairman)',
    adminEmail: 'admin@vvt.org.in',
    action: 'SYSTEM_INITIALIZATION',
    module: 'System',
    recordTitle: 'Portal Initialized with VVDC & VVHSS Wings',
    details: 'Initial setup of wings, admission notifications, and public event schedules.',
    timestamp: '2026-03-20T08:00:00.000Z',
  },
  {
    id: 'log-2',
    adminName: 'Academic Coordinator',
    adminEmail: 'coordinator@vvt.edu.in',
    action: 'NOTICE_PUBLISH',
    module: 'Notices',
    recordTitle: 'Admissions Open for Academic Session 2026-27',
    details: 'Published notification with attached prospectus brochure.',
    timestamp: '2026-03-25T09:00:00.000Z',
  },
];

// Seed Faculty & Academic Experts
const initialExperts: Expert[] = [
  {
    id: 'exp-1',
    name: 'Dr. Ramesh Chandra Mahanta',
    designation: 'Principal & Professor of Physics',
    department: 'Department of Physics',
    wingId: 'wing-vvdc',
    qualification: 'M.Sc. (Physics), Ph.D. (Solid State Physics), F.I.P.S.',
    experience: '22+ Years in Academic Administration & Condensed Matter Research',
    specialization: 'Condensed Matter Physics, Semiconductor Thin Films & Renewable Energy',
    bio: 'Dr. Mahanta has published over 30 research articles in international peer-reviewed journals and guides undergraduate research projects at Vishwa Vinayak Degree College.',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    email: 'principal.vvdc@vvt.edu.in',
    phone: '+91 9437238689',
    status: 'active',
    order: 1,
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'exp-2',
    name: 'Prof. Subhashree Mohanty',
    designation: 'Principal & Senior Lecturer in English',
    department: 'Department of Humanities & Languages',
    wingId: 'wing-vvhss',
    qualification: 'M.A. in English (Gold Medalist), M.Ed., M.Phil.',
    experience: '18+ Years in Higher Secondary Pedagogy & Communicative English',
    specialization: 'ELT (English Language Teaching), Indian Writing in English, Student Counseling',
    bio: 'Author of standard communicative English guides for CHSE students, mentoring high school and secondary students to qualify for state and national competitive examinations.',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    email: 'principal.vvhss@vvt.edu.in',
    phone: '+91 9437614185',
    status: 'active',
    order: 2,
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'exp-3',
    name: 'Dr. Bijay Kumar Dash',
    designation: 'Head & Associate Professor of Chemistry',
    department: 'Department of Chemistry',
    wingId: 'wing-vvdc',
    qualification: 'M.Sc., Ph.D. in Organic Chemistry, CSIR-NET',
    experience: '16+ Years in Undergraduate Teaching & Analytical Chemistry Lab Setup',
    specialization: 'Organic Synthesis, Green Chemistry & Water Quality Analysis in Mineral Belts',
    bio: 'Leads environmental chemical testing projects for Kendujhar water resources and mentors B.Sc. Chemistry Honours students in spectroscopic instrumentation.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    email: 'b.dash.chem@vvt.edu.in',
    phone: '+91 9437123456',
    status: 'active',
    order: 3,
    createdAt: '2024-02-15T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'exp-4',
    name: 'Prof. Ananya Patra',
    designation: 'Senior Lecturer in Mathematics & Statistics',
    department: 'Department of Mathematics',
    wingId: 'wing-vvdc',
    qualification: 'M.Sc. in Applied Mathematics (Utkal University), GATE, B.Ed.',
    experience: '11+ Years in Mathematical Modeling & IIT-JAM / JEE Coaching',
    specialization: 'Differential Equations, Numerical Analysis, Operations Research',
    bio: 'Passionate educator specializing in competitive mathematics, differential geometry, and conducting workshops on mathematical problem solving.',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    email: 'a.patra.math@vvt.edu.in',
    phone: '+91 9861987654',
    status: 'active',
    order: 4,
    createdAt: '2024-03-10T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'exp-5',
    name: 'Dr. Manas Ranjan Jena',
    designation: 'Assistant Professor & Department Coordinator (Botany)',
    department: 'Department of Botany & Life Sciences',
    wingId: 'wing-vvdc',
    qualification: 'M.Sc. (Botany), Ph.D. (Plant Taxonomy & Biodiversity)',
    experience: '12+ Years in Floristic Surveys & Herbal Drug Research',
    specialization: 'Ethnobotany of North Odisha, Plant Tissue Culture & Environmental Conservation',
    bio: 'Recognized researcher on the medicinal flora of Kendujhar district with a dedicated herbarium maintained at the VVDC campus botanical garden.',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    email: 'm.jena.botany@vvt.edu.in',
    phone: '+91 9439123890',
    status: 'active',
    order: 5,
    createdAt: '2024-04-05T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'exp-6',
    name: 'Prof. Rashmita Sahu',
    designation: 'Head of Commerce & Business Studies',
    department: 'Department of Commerce & Management',
    wingId: 'wing-vvdc',
    qualification: 'M.Com., M.Phil., UGC-NET Qualified',
    experience: '14+ Years in Financial Accounting, Auditing & Career Counseling',
    specialization: 'Corporate Accounting, GST Practice, Financial Markets & Rural Banking',
    bio: 'Directs the Commerce Guidance Forum at Vishwa Vinayak Degree College, bridging rural commerce students with chartered accountancy preparation and banking careers.',
    photo: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=600&q=80',
    email: 'r.sahu.commerce@vvt.edu.in',
    phone: '+91 9778123456',
    status: 'active',
    order: 6,
    createdAt: '2024-05-12T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z',
  },
];

// In-Memory fallback for environments where window.localStorage might be unavailable
let memoryStore: Record<string, string> = {};

function getStoreItem<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = window.localStorage.getItem(key);
      if (item) {
        return JSON.parse(item) as T;
      }
    } else if (memoryStore[key]) {
      return JSON.parse(memoryStore[key]) as T;
    }
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
  }
  return defaultValue;
}

function setStoreItem<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, serialized);
    }
    memoryStore[key] = serialized;
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

// Helper to async upsert to Supabase
async function syncToSupabase(table: string, payload: any) {
  try {
    const { error } = await supabase.from(table).upsert(payload);
    if (error) {
      console.warn(`[Supabase ${table}] sync notification:`, error.message);
    }
  } catch (e) {
    console.warn(`[Supabase ${table}] network notification:`, e);
  }
}

// Helper to async delete from Supabase
async function deleteFromSupabase(table: string, id: string) {
  try {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      console.warn(`[Supabase ${table}] delete notification:`, error.message);
    }
  } catch (e) {
    console.warn(`[Supabase ${table}] network delete:`, e);
  }
}

// Storage Manager Service
export const storageService = {
  // Initialize storage if empty and trigger background Supabase sync
  init() {
    if (!this.getWings().length) this.setWings(initialWings);
    if (!this.getExperts().length) this.setExperts(initialExperts);
    if (!this.getSliders().length) this.setSliders(initialSliders);
    if (!this.getNotices().length) this.setNotices(initialNotices);
    if (!this.getEvents().length) this.setEvents(initialEvents);
    if (!this.getAlbums().length) this.setAlbums(initialAlbums);
    if (!this.getApplications().length) this.setApplications(initialApplications);
    if (!this.getEnquiries().length) this.setEnquiries(initialEnquiries);
    if (!this.getAdmins().length) {
      this.setAdmins(initialAdmins);
    } else {
      // Ensure super admin Chairman name and email reflect Mr. Rabinarayana Mohanta (Trust Chairman) & admin@vvt.org.in
      const currentAdmins = this.getAdmins();
      let changed = false;
      currentAdmins.forEach((a) => {
        if (a.id === 'adm-1' || a.role === 'super_admin' || a.email.toLowerCase() === 'admin@vvt.edu.in' || a.email.toLowerCase() === 'admin@vvt.org.in') {
          if (a.fullName !== 'Mr. Rabinarayana Mohanta (Trust Chairman)') {
            a.fullName = 'Mr. Rabinarayana Mohanta (Trust Chairman)';
            changed = true;
          }
          if (a.email !== 'admin@vvt.org.in') {
            a.email = 'admin@vvt.org.in';
            changed = true;
          }
        }
      });
      if (changed) {
        this.setAdmins(currentAdmins);
      }
    }

    // Also update any active session for super admin
    const activeSession = this.getCurrentSession();
    if (activeSession && (activeSession.id === 'adm-1' || activeSession.role === 'super_admin' || activeSession.email?.toLowerCase() === 'admin@vvt.edu.in' || activeSession.email?.toLowerCase() === 'admin@vvt.org.in')) {
      let sessionChanged = false;
      if (activeSession.fullName !== 'Mr. Rabinarayana Mohanta (Trust Chairman)') {
        activeSession.fullName = 'Mr. Rabinarayana Mohanta (Trust Chairman)';
        sessionChanged = true;
      }
      if (activeSession.email !== 'admin@vvt.org.in') {
        activeSession.email = 'admin@vvt.org.in';
        sessionChanged = true;
      }
      if (sessionChanged) {
        this.setCurrentSession(activeSession);
      }
    }

    if (!this.getLogs().length) this.setLogs(initialLogs);
    if (!this.getSettings().institutionName) this.setSettings(initialSettings);

    // Sync from remote Supabase if available
    this.syncFromSupabase().catch((err) => {
      console.info('Supabase background sync initialized:', err?.message || 'ready');
    });
  },

  // Pull latest records from Supabase tables
  async syncFromSupabase(): Promise<{ synced: boolean; message: string }> {
    try {
      // 1. Wings
      const { data: remoteWings, error: wErr } = await supabase
        .from(SUPABASE_TABLES.WINGS)
        .select('*');
      if (!wErr && remoteWings && remoteWings.length > 0) {
        this.setWings(remoteWings as Wing[]);
      }

      // 1b. Experts
      const { data: remoteExperts, error: expErr } = await supabase
        .from(SUPABASE_TABLES.EXPERTS)
        .select('*')
        .order('order', { ascending: true });
      if (!expErr && remoteExperts && remoteExperts.length > 0) {
        this.setExperts(remoteExperts as Expert[]);
      }

      // 2. Sliders
      const { data: remoteSliders, error: sErr } = await supabase
        .from(SUPABASE_TABLES.SLIDERS)
        .select('*')
        .order('order', { ascending: true });
      if (!sErr && remoteSliders && remoteSliders.length > 0) {
        this.setSliders(remoteSliders as Slider[]);
      }

      // 3. Notices
      const { data: remoteNotices, error: nErr } = await supabase
        .from(SUPABASE_TABLES.NOTICES)
        .select('*')
        .order('noticeDate', { ascending: false });
      if (!nErr && remoteNotices && remoteNotices.length > 0) {
        this.setNotices(remoteNotices as Notice[]);
      }

      // 4. Events
      const { data: remoteEvents, error: eErr } = await supabase
        .from(SUPABASE_TABLES.EVENTS)
        .select('*')
        .order('eventDate', { ascending: false });
      if (!eErr && remoteEvents && remoteEvents.length > 0) {
        this.setEvents(remoteEvents as EventItem[]);
      }

      // 5. Gallery
      const { data: remoteGallery, error: gErr } = await supabase
        .from(SUPABASE_TABLES.GALLERY)
        .select('*');
      if (!gErr && remoteGallery && remoteGallery.length > 0) {
        this.setAlbums(remoteGallery as GalleryAlbum[]);
      }

      // 6. Applications (CV Details)
      const { data: remoteApps, error: aErr } = await supabase
        .from(SUPABASE_TABLES.APPLICATIONS)
        .select('*')
        .order('createdAt', { ascending: false });
      if (!aErr && remoteApps && remoteApps.length > 0) {
        this.setApplications(remoteApps as CareerApplication[]);
      }

      // 7. Enquiries
      const { data: remoteEnq, error: eqErr } = await supabase
        .from(SUPABASE_TABLES.ENQUIRIES)
        .select('*')
        .order('createdAt', { ascending: false });
      if (!eqErr && remoteEnq && remoteEnq.length > 0) {
        this.setEnquiries(remoteEnq as ContactEnquiry[]);
      }

      // 8. Settings
      const { data: remoteSettings, error: setErr } = await supabase
        .from(SUPABASE_TABLES.SETTINGS)
        .select('data')
        .eq('id', 'primary_settings')
        .maybeSingle();
      if (!setErr && remoteSettings?.data) {
        this.setSettings(remoteSettings.data as SiteSettings);
      }

      return {
        synced: true,
        message: 'Successfully refreshed data from Supabase account.',
      };
    } catch (e: any) {
      return {
        synced: false,
        message: e?.message || 'Supabase tables pending creation.',
      };
    }
  },

  // Push all local data into Supabase (Batch Sync)
  async pushAllToSupabase(): Promise<{
    success: boolean;
    syncedCount: number;
    errors: string[];
  }> {
    let syncedCount = 0;
    const errors: string[] = [];

    // Push Wings
    const wings = this.getWings();
    for (const w of wings) {
      const { error } = await supabase.from(SUPABASE_TABLES.WINGS).upsert(w);
      if (error) errors.push(`Wings: ${error.message}`);
      else syncedCount++;
    }

    // Push Experts
    const experts = this.getExperts();
    for (const exp of experts) {
      const { error } = await supabase.from(SUPABASE_TABLES.EXPERTS).upsert(exp);
      if (error) errors.push(`Experts: ${error.message}`);
      else syncedCount++;
    }

    // Push Sliders
    const sliders = this.getSliders();
    for (const s of sliders) {
      const { error } = await supabase.from(SUPABASE_TABLES.SLIDERS).upsert(s);
      if (error) errors.push(`Sliders: ${error.message}`);
      else syncedCount++;
    }

    // Push Notices
    const notices = this.getNotices();
    for (const n of notices) {
      const { error } = await supabase.from(SUPABASE_TABLES.NOTICES).upsert(n);
      if (error) errors.push(`Notices: ${error.message}`);
      else syncedCount++;
    }

    // Push Events
    const events = this.getEvents();
    for (const ev of events) {
      const { error } = await supabase.from(SUPABASE_TABLES.EVENTS).upsert(ev);
      if (error) errors.push(`Events: ${error.message}`);
      else syncedCount++;
    }

    // Push Gallery Albums
    const albums = this.getAlbums();
    for (const alb of albums) {
      const { error } = await supabase.from(SUPABASE_TABLES.GALLERY).upsert(alb);
      if (error) errors.push(`Gallery: ${error.message}`);
      else syncedCount++;
    }

    // Push Applications (CV uploads)
    const apps = this.getApplications();
    for (const a of apps) {
      const { error } = await supabase.from(SUPABASE_TABLES.APPLICATIONS).upsert(a);
      if (error) errors.push(`Applications: ${error.message}`);
      else syncedCount++;
    }

    // Push Enquiries
    const enquiries = this.getEnquiries();
    for (const enq of enquiries) {
      const { error } = await supabase.from(SUPABASE_TABLES.ENQUIRIES).upsert(enq);
      if (error) errors.push(`Enquiries: ${error.message}`);
      else syncedCount++;
    }

    // Push Settings
    const settings = this.getSettings();
    const { error: settErr } = await supabase
      .from(SUPABASE_TABLES.SETTINGS)
      .upsert({ id: 'primary_settings', data: settings });
    if (settErr) errors.push(`Settings: ${settErr.message}`);
    else syncedCount++;

    return {
      success: errors.length === 0,
      syncedCount,
      errors,
    };
  },

  // Reset to sample defaults
  resetToDefaults() {
    this.setWings(initialWings);
    this.setExperts(initialExperts);
    this.setSliders(initialSliders);
    this.setNotices(initialNotices);
    this.setEvents(initialEvents);
    this.setAlbums(initialAlbums);
    this.setApplications(initialApplications);
    this.setEnquiries(initialEnquiries);
    this.setAdmins(initialAdmins);
    this.setLogs(initialLogs);
    this.setSettings(initialSettings);
  },

  // Wings CRUD
  getWings(): Wing[] {
    return getStoreItem<Wing[]>(STORAGE_KEYS.WINGS, initialWings);
  },
  setWings(wings: Wing[]) {
    setStoreItem(STORAGE_KEYS.WINGS, wings);
  },
  getWingBySlug(slug: string): Wing | undefined {
    return this.getWings().find(
      (w) => w.slug.toLowerCase() === slug.toLowerCase() || w.id === slug
    );
  },
  saveWing(wing: Wing, currentAdmin?: AdminUser): Wing {
    const wings = this.getWings();
    const index = wings.findIndex((w) => w.id === wing.id);
    const now = new Date().toISOString();
    let saved: Wing;

    if (index >= 0) {
      saved = { ...wing, updatedAt: now };
      wings[index] = saved;
      this.logAction(
        currentAdmin,
        'UPDATE_WING',
        'Wings',
        wing.name,
        `Updated details for wing: ${wing.shortName}`
      );
    } else {
      saved = {
        ...wing,
        id: wing.id || `wing-${Date.now()}`,
        slug:
          wing.slug ||
          wing.shortName.toLowerCase().replace(/[^a-z0-9]/g, '-') ||
          `wing-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      wings.push(saved);
      this.logAction(
        currentAdmin,
        'CREATE_WING',
        'Wings',
        wing.name,
        `Created new wing: ${wing.name} (${wing.shortName})`
      );
    }
    this.setWings(wings);
    syncToSupabase(SUPABASE_TABLES.WINGS, saved);
    return saved;
  },
  deleteWing(id: string, currentAdmin?: AdminUser): boolean {
    const wings = this.getWings();
    const wing = wings.find((w) => w.id === id);
    if (!wing) return false;
    const filtered = wings.filter((w) => w.id !== id);
    this.setWings(filtered);
    deleteFromSupabase(SUPABASE_TABLES.WINGS, id);
    this.logAction(
      currentAdmin,
      'DELETE_WING',
      'Wings',
      wing.name,
      `Deleted wing: ${wing.name}`
    );
    return true;
  },

  // Experts & Faculty CRUD
  getExperts(): Expert[] {
    return getStoreItem<Expert[]>(STORAGE_KEYS.EXPERTS, initialExperts).sort(
      (a, b) => a.order - b.order
    );
  },
  setExperts(experts: Expert[]) {
    setStoreItem(STORAGE_KEYS.EXPERTS, experts);
  },
  getExpertById(id: string): Expert | undefined {
    return this.getExperts().find((e) => e.id === id);
  },
  saveExpert(expert: Expert, currentAdmin?: AdminUser): Expert {
    const experts = this.getExperts();
    const index = experts.findIndex((e) => e.id === expert.id);
    const now = new Date().toISOString();
    let saved: Expert;

    if (index >= 0) {
      saved = { ...expert, updatedAt: now };
      experts[index] = saved;
      this.logAction(
        currentAdmin,
        'UPDATE_EXPERT',
        'Experts',
        expert.name,
        `Updated details for faculty/expert: ${expert.name} (${expert.designation})`
      );
    } else {
      saved = {
        ...expert,
        id: expert.id || `exp-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      experts.push(saved);
      this.logAction(
        currentAdmin,
        'CREATE_EXPERT',
        'Experts',
        expert.name,
        `Added new faculty/expert: ${expert.name} (${expert.designation})`
      );
    }
    this.setExperts(experts);
    syncToSupabase(SUPABASE_TABLES.EXPERTS, saved);
    return saved;
  },
  deleteExpert(id: string, currentAdmin?: AdminUser): boolean {
    const experts = this.getExperts();
    const item = experts.find((e) => e.id === id);
    if (!item) return false;
    this.setExperts(experts.filter((e) => e.id !== id));
    deleteFromSupabase(SUPABASE_TABLES.EXPERTS, id);
    this.logAction(
      currentAdmin,
      'DELETE_EXPERT',
      'Experts',
      item.name,
      `Removed faculty/expert: ${item.name}`
    );
    return true;
  },

  // Sliders CRUD
  getSliders(): Slider[] {
    return getStoreItem<Slider[]>(STORAGE_KEYS.SLIDERS, initialSliders).sort(
      (a, b) => a.order - b.order
    );
  },
  setSliders(sliders: Slider[]) {
    setStoreItem(STORAGE_KEYS.SLIDERS, sliders);
  },
  saveSlider(slider: Slider, currentAdmin?: AdminUser): Slider {
    const sliders = this.getSliders();
    const index = sliders.findIndex((s) => s.id === slider.id);
    let saved: Slider;
    if (index >= 0) {
      saved = slider;
      sliders[index] = saved;
      this.logAction(currentAdmin, 'UPDATE_SLIDER', 'Slider', slider.heading);
    } else {
      saved = {
        ...slider,
        id: slider.id || `slider-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      sliders.push(saved);
      this.logAction(currentAdmin, 'CREATE_SLIDER', 'Slider', slider.heading);
    }
    this.setSliders(sliders);
    syncToSupabase(SUPABASE_TABLES.SLIDERS, saved);
    return saved;
  },
  deleteSlider(id: string, currentAdmin?: AdminUser): boolean {
    const sliders = this.getSliders();
    const slider = sliders.find((s) => s.id === id);
    if (!slider) return false;
    this.setSliders(sliders.filter((s) => s.id !== id));
    deleteFromSupabase(SUPABASE_TABLES.SLIDERS, id);
    this.logAction(currentAdmin, 'DELETE_SLIDER', 'Slider', slider.heading);
    return true;
  },

  // Notices CRUD
  getNotices(): Notice[] {
    return getStoreItem<Notice[]>(STORAGE_KEYS.NOTICES, initialNotices).sort(
      (a, b) => new Date(b.noticeDate).getTime() - new Date(a.noticeDate).getTime()
    );
  },
  setNotices(notices: Notice[]) {
    setStoreItem(STORAGE_KEYS.NOTICES, notices);
  },
  saveNotice(notice: Notice, currentAdmin?: AdminUser): Notice {
    const notices = this.getNotices();
    const index = notices.findIndex((n) => n.id === notice.id);
    let saved: Notice;
    if (index >= 0) {
      saved = notice;
      notices[index] = saved;
      this.logAction(currentAdmin, 'UPDATE_NOTICE', 'Notices', notice.title);
    } else {
      saved = {
        ...notice,
        id: notice.id || `not-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      notices.push(saved);
      this.logAction(currentAdmin, 'CREATE_NOTICE', 'Notices', notice.title);
    }
    this.setNotices(notices);
    syncToSupabase(SUPABASE_TABLES.NOTICES, saved);
    return saved;
  },
  deleteNotice(id: string, currentAdmin?: AdminUser): boolean {
    const notices = this.getNotices();
    const item = notices.find((n) => n.id === id);
    if (!item) return false;
    this.setNotices(notices.filter((n) => n.id !== id));
    deleteFromSupabase(SUPABASE_TABLES.NOTICES, id);
    this.logAction(currentAdmin, 'DELETE_NOTICE', 'Notices', item.title);
    return true;
  },

  // Events CRUD
  getEvents(): EventItem[] {
    return getStoreItem<EventItem[]>(STORAGE_KEYS.EVENTS, initialEvents).sort(
      (a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
    );
  },
  setEvents(events: EventItem[]) {
    setStoreItem(STORAGE_KEYS.EVENTS, events);
  },
  saveEvent(evt: EventItem, currentAdmin?: AdminUser): EventItem {
    const events = this.getEvents();
    const index = events.findIndex((e) => e.id === evt.id);
    let saved: EventItem;
    if (index >= 0) {
      saved = evt;
      events[index] = saved;
      this.logAction(currentAdmin, 'UPDATE_EVENT', 'Events', evt.title);
    } else {
      saved = {
        ...evt,
        id: evt.id || `evt-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      events.push(saved);
      this.logAction(currentAdmin, 'CREATE_EVENT', 'Events', evt.title);
    }
    this.setEvents(events);
    syncToSupabase(SUPABASE_TABLES.EVENTS, saved);
    return saved;
  },
  deleteEvent(id: string, currentAdmin?: AdminUser): boolean {
    const events = this.getEvents();
    const item = events.find((e) => e.id === id);
    if (!item) return false;
    this.setEvents(events.filter((e) => e.id !== id));
    deleteFromSupabase(SUPABASE_TABLES.EVENTS, id);
    this.logAction(currentAdmin, 'DELETE_EVENT', 'Events', item.title);
    return true;
  },

  // Gallery CRUD
  getAlbums(): GalleryAlbum[] {
    return getStoreItem<GalleryAlbum[]>(STORAGE_KEYS.GALLERY, initialAlbums);
  },
  setAlbums(albums: GalleryAlbum[]) {
    setStoreItem(STORAGE_KEYS.GALLERY, albums);
  },
  saveAlbum(album: GalleryAlbum, currentAdmin?: AdminUser): GalleryAlbum {
    const albums = this.getAlbums();
    const index = albums.findIndex((a) => a.id === album.id);
    let saved: GalleryAlbum;
    if (index >= 0) {
      saved = album;
      albums[index] = saved;
      this.logAction(currentAdmin, 'UPDATE_ALBUM', 'Gallery', album.title);
    } else {
      saved = {
        ...album,
        id: album.id || `alb-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      albums.push(saved);
      this.logAction(currentAdmin, 'CREATE_ALBUM', 'Gallery', album.title);
    }
    this.setAlbums(albums);
    syncToSupabase(SUPABASE_TABLES.GALLERY, saved);
    return saved;
  },
  deleteAlbum(id: string, currentAdmin?: AdminUser): boolean {
    const albums = this.getAlbums();
    const item = albums.find((a) => a.id === id);
    if (!item) return false;
    this.setAlbums(albums.filter((a) => a.id !== id));
    deleteFromSupabase(SUPABASE_TABLES.GALLERY, id);
    this.logAction(currentAdmin, 'DELETE_ALBUM', 'Gallery', item.title);
    return true;
  },

  // Career Applications
  getApplications(): CareerApplication[] {
    return getStoreItem<CareerApplication[]>(
      STORAGE_KEYS.APPLICATIONS,
      initialApplications
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  setApplications(apps: CareerApplication[]) {
    setStoreItem(STORAGE_KEYS.APPLICATIONS, apps);
  },
  submitApplication(
    app: Omit<CareerApplication, 'id' | 'applicationId' | 'status' | 'createdAt' | 'updatedAt'>
  ): CareerApplication {
    const apps = this.getApplications();
    const count = apps.length + 1;
    const year = new Date().getFullYear();
    const formattedId = `VVTI-${year}-${String(count).padStart(6, '0')}`;
    const now = new Date().toISOString();

    const newApp: CareerApplication = {
      ...app,
      id: `app-${Date.now()}`,
      applicationId: formattedId,
      status: 'new',
      createdAt: now,
      updatedAt: now,
    };

    apps.unshift(newApp);
    this.setApplications(apps);
    syncToSupabase(SUPABASE_TABLES.APPLICATIONS, newApp);
    return newApp;
  },
  async submitApplicationAsync(
    app: Omit<CareerApplication, 'id' | 'applicationId' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<{ app: CareerApplication; supabaseSuccess: boolean; message: string }> {
    const apps = this.getApplications();
    const count = apps.length + 1;
    const year = new Date().getFullYear();
    const formattedId = `VVTI-${year}-${String(count).padStart(6, '0')}`;
    const now = new Date().toISOString();

    const newApp: CareerApplication = {
      ...app,
      id: `app-${Date.now()}`,
      applicationId: formattedId,
      status: 'new',
      createdAt: now,
      updatedAt: now,
    };

    apps.unshift(newApp);
    this.setApplications(apps);

    let supabaseSuccess = false;
    let message = 'Saved to database.';

    try {
      const { error } = await supabase.from(SUPABASE_TABLES.APPLICATIONS).upsert(newApp);
      if (error) {
        console.warn('[Supabase Applications save note]:', error.message);
        message = `Saved to local repository. Supabase note: ${error.message}`;
      } else {
        supabaseSuccess = true;
        message = 'Saved directly to your Supabase cloud account (vvt_applications)!';
      }
    } catch (e: any) {
      console.warn('[Supabase Applications network note]:', e);
      message = `Saved to local repository (${e?.message || 'cloud sync ready'})`;
    }

    return { app: newApp, supabaseSuccess, message };
  },
  updateApplicationStatus(
    id: string,
    status: CareerApplication['status'],
    adminRemarks: string,
    currentAdmin?: AdminUser
  ): boolean {
    const apps = this.getApplications();
    const item = apps.find((a) => a.id === id);
    if (!item) return false;
    item.status = status;
    item.adminRemarks = adminRemarks;
    item.updatedAt = new Date().toISOString();
    this.setApplications(apps);
    syncToSupabase(SUPABASE_TABLES.APPLICATIONS, item);
    this.logAction(
      currentAdmin,
      'UPDATE_APPLICATION_STATUS',
      'Career',
      item.applicationId,
      `Changed status to: ${status}. Remarks: ${adminRemarks || 'None'}`
    );
    return true;
  },
  deleteApplication(id: string, currentAdmin?: AdminUser): boolean {
    const apps = this.getApplications();
    const item = apps.find((a) => a.id === id);
    if (!item) return false;
    this.setApplications(apps.filter((a) => a.id !== id));
    deleteFromSupabase(SUPABASE_TABLES.APPLICATIONS, id);
    this.logAction(
      currentAdmin,
      'DELETE_APPLICATION',
      'Career',
      item.applicationId,
      `Deleted application of: ${item.fullName}`
    );
    return true;
  },

  // Contact Enquiries
  getEnquiries(): ContactEnquiry[] {
    return getStoreItem<ContactEnquiry[]>(STORAGE_KEYS.ENQUIRIES, initialEnquiries).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
  setEnquiries(enquiries: ContactEnquiry[]) {
    setStoreItem(STORAGE_KEYS.ENQUIRIES, enquiries);
  },
  submitEnquiry(enquiry: Omit<ContactEnquiry, 'id' | 'status' | 'createdAt'>): ContactEnquiry {
    const enquiries = this.getEnquiries();
    const newEnq: ContactEnquiry = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      status: 'unread',
      createdAt: new Date().toISOString(),
    };
    enquiries.unshift(newEnq);
    this.setEnquiries(enquiries);
    syncToSupabase(SUPABASE_TABLES.ENQUIRIES, newEnq);
    return newEnq;
  },
  updateEnquiryStatus(
    id: string,
    status: ContactEnquiry['status'],
    replyNotes?: string,
    currentAdmin?: AdminUser
  ): boolean {
    const enquiries = this.getEnquiries();
    const item = enquiries.find((e) => e.id === id);
    if (!item) return false;
    item.status = status;
    if (replyNotes !== undefined) item.replyNotes = replyNotes;
    this.setEnquiries(enquiries);
    syncToSupabase(SUPABASE_TABLES.ENQUIRIES, item);
    this.logAction(
      currentAdmin,
      'UPDATE_ENQUIRY',
      'Enquiries',
      item.subject,
      `Status changed to: ${status}`
    );
    return true;
  },
  deleteEnquiry(id: string, currentAdmin?: AdminUser): boolean {
    const enquiries = this.getEnquiries();
    const item = enquiries.find((e) => e.id === id);
    if (!item) return false;
    this.setEnquiries(enquiries.filter((e) => e.id !== id));
    deleteFromSupabase(SUPABASE_TABLES.ENQUIRIES, id);
    this.logAction(currentAdmin, 'DELETE_ENQUIRY', 'Enquiries', item.subject);
    return true;
  },

  // Admin Users
  getAdmins(): AdminUser[] {
    return getStoreItem<AdminUser[]>(STORAGE_KEYS.ADMINS, initialAdmins);
  },
  setAdmins(admins: AdminUser[]) {
    setStoreItem(STORAGE_KEYS.ADMINS, admins);
  },
  saveAdmin(admin: AdminUser, currentAdmin?: AdminUser): AdminUser {
    const admins = this.getAdmins();
    const index = admins.findIndex((a) => a.id === admin.id);
    let saved: AdminUser;
    if (index >= 0) {
      saved = admin;
      admins[index] = saved;
      this.logAction(currentAdmin, 'UPDATE_ADMIN', 'Users', admin.fullName);
    } else {
      saved = {
        ...admin,
        id: admin.id || `adm-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      admins.push(saved);
      this.logAction(currentAdmin, 'CREATE_ADMIN', 'Users', admin.fullName);
    }
    this.setAdmins(admins);
    syncToSupabase(SUPABASE_TABLES.ADMINS, saved);
    return saved;
  },
  deleteAdmin(id: string, currentAdmin?: AdminUser): boolean {
    const admins = this.getAdmins();
    const item = admins.find((a) => a.id === id);
    if (!item) return false;
    if (admins.length <= 1) return false; // Prevent deleting the sole admin
    this.setAdmins(admins.filter((a) => a.id !== id));
    deleteFromSupabase(SUPABASE_TABLES.ADMINS, id);
    this.logAction(currentAdmin, 'DELETE_ADMIN', 'Users', item.fullName);
    return true;
  },

  // Site Settings
  getSettings(): SiteSettings {
    return getStoreItem<SiteSettings>(STORAGE_KEYS.SETTINGS, initialSettings);
  },
  setSettings(settings: SiteSettings) {
    setStoreItem(STORAGE_KEYS.SETTINGS, settings);
  },
  updateSettings(settings: SiteSettings, currentAdmin?: AdminUser): SiteSettings {
    this.setSettings(settings);
    syncToSupabase(SUPABASE_TABLES.SETTINGS, { id: 'primary_settings', data: settings });
    this.logAction(
      currentAdmin,
      'UPDATE_SETTINGS',
      'Settings',
      'Site CMS & Contact Settings Updated'
    );
    return settings;
  },

  // Activity Logs
  getLogs(): ActivityLog[] {
    return getStoreItem<ActivityLog[]>(STORAGE_KEYS.LOGS, initialLogs).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  },
  setLogs(logs: ActivityLog[]) {
    setStoreItem(STORAGE_KEYS.LOGS, logs);
  },
  logAction(
    currentAdmin: AdminUser | undefined,
    action: string,
    module: string,
    recordTitle: string,
    details?: string
  ) {
    const logs = this.getLogs();
    const newLog: ActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      adminName: currentAdmin ? currentAdmin.fullName : 'System Administrator',
      adminEmail: currentAdmin ? currentAdmin.email : 'admin@vvt.org.in',
      action,
      module,
      recordTitle,
      details,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newLog);
    // Keep max 200 logs
    if (logs.length > 200) logs.pop();
    this.setLogs(logs);
    syncToSupabase(SUPABASE_TABLES.LOGS, newLog);
  },

  // Session
  getCurrentSession(): AdminUser | null {
    return getStoreItem<AdminUser | null>(STORAGE_KEYS.CURRENT_ADMIN, null);
  },
  setCurrentSession(admin: AdminUser | null) {
    setStoreItem(STORAGE_KEYS.CURRENT_ADMIN, admin);
  },

  // Export utilities ("Download Expert" / CSV / Excel export)
  exportToCSV(filename: string, rows: Record<string, unknown>[]) {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        headers
          .map((header) => {
            const val = row[header];
            if (val === null || val === undefined) return '""';
            const escaped = String(val).replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(',')
      ),
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};

// Auto initialize on import
if (typeof window !== 'undefined') {
  storageService.init();
}
