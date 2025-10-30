import { ExerciseTemplate } from "../models/ExerciseTemplate";
import { GroupType, NotificationType, FieldType } from "../types";

export const seedExercises = async () => {
  try {
    // Check if exercises already exist
    const existingCount = await ExerciseTemplate.countDocuments({ isCustom: false });
    if (existingCount > 0) {
      console.log("✅ Default exercises already exist");
      return;
    }

    // CONTROL GROUP EXERCISES
    const controlExercises = [
      {
        title: "پیش‌بینی موقعیت اجتماعی",
        groupType: GroupType.CONTROL,
        order: 1,
        description:
          "در این تمرین، شما یاد می‌گیرید که چطور بدون قضاوت، توجه‌تان را به تجربه‌های روزمره‌ی خود مانند افکار، احساسات و رفتارها معطوف کنید.",
        instructions:
          "فکر کن امروز قراره در چه موقعیت اجتماعی‌ای باشی، قراره چی حس کنی، و قراره چطور باهاش کنار بیای.",
        notifications: [
          {
            type: NotificationType.MORNING,
            count: 1,
            scheduleType: "user_time",
            messages: ["سلام! وقتشه کمی برای موقعیت اجتماعی امروزت آماده بشی."],
          },
        ],
        fields: [
          {
            id: "social_event",
            type: FieldType.TEXTAREA,
            label: "رویداد اجتماعی پیش‌رو را مشخص کنید",
            placeholder: "نام این موقعیت را اینجا وارد کنید...",
            required: true,
            order: 1,
          },
          {
            id: "prediction",
            type: FieldType.TEXTAREA,
            label: "پیش‌بینی افکار و احساسات",
            placeholder: "پیش‌بینی می‌کنید در این موقعیت چه افکاری به ذهن‌تان بیاید؟",
            required: true,
            order: 2,
          },
          {
            id: "approach",
            type: FieldType.TEXTAREA,
            label: "نحوه‌ی مواجهه",
            placeholder: "برنامه‌تان برای مواجهه با این موقعیت چیست؟",
            required: true,
            order: 3,
          },
        ],
        completionMessage: "تمرین امروزت کامل شد، منتظر ارسال پیام‌های ما برای شروع تمرین بعدی باش.",
        isCustom: false,
        createdBy: "system",
      },
      {
        title: "توجه به افکار و احساسات در لحظه‌ی حال",
        groupType: GroupType.CONTROL,
        order: 2,
        description:
          "در طول روز، ذهن ما دائم در حال حرکت و فکر کردن است. در این تمرین، از شما خواسته می‌شود چند بار در طول روز، فقط برای چند دقیقه، متوقف شوید.",
        instructions: "بدون اینکه قضاوت کنی یا بخوای چیزی رو تغییر بدی، فقط توجه کن.",
        notifications: [
          {
            type: NotificationType.RANDOM,
            count: 3,
            scheduleType: "random",
            timeRanges: [
              { start: "10:00", end: "12:00" },
              { start: "14:00", end: "16:00" },
              { start: "18:00", end: "20:00" },
            ],
            messages: [
              "یک لحظه توقف کن... الان دقیقاً در این لحظه، چه افکار و احساساتی داری؟",
              "ممکنه حس خوبی رو تجربه کنی و ذهنت بخواد با نگرانی یا شک اون رو قطع کنه.",
              "اگه الان در یک جمع هستی یا با کسی در گفت‌وگویی، ببین آیا حتی یه لحظه احساس خوبی داشتی؟",
            ],
          },
        ],
        fields: [
          {
            id: "current_thoughts",
            type: FieldType.TEXTAREA,
            label: "افکار فعلی شما چیست؟",
            placeholder: "در این لحظه، دقیقاً چه فکری در ذهن‌تان است؟",
            required: true,
            order: 1,
          },
          {
            id: "current_feelings",
            type: FieldType.TEXTAREA,
            label: "چه احساسی دارید؟",
            placeholder: "آیا می‌توانید برای احساسی که الان دارید یک اسم پیدا کنید؟",
            required: true,
            order: 2,
          },
          {
            id: "body_reactions",
            type: FieldType.TEXTAREA,
            label: "واکنش‌های بدنی‌تان چیست؟",
            placeholder: "آیا متوجه احساسی در بدن‌تان هستید؟",
            required: false,
            order: 3,
          },
        ],
        completionMessage: "تمرین امروزت کامل شد، منتظر ارسال پیام‌های ما برای شروع تمرین بعدی باش.",
        isCustom: false,
        createdBy: "system",
      },
      {
        title: "یادآوری یک رویداد اجتماعی معمولی",
        groupType: GroupType.CONTROL,
        order: 3,
        description: "ذهن ما عادت دارد که رویدادهای اجتماعی را سریع، سطحی یا همراه با قضاوت مرور کند.",
        instructions: "امروز چه موقعیت اجتماعی‌ای داشتی—حتی اگر ساده بود؟",
        notifications: [
          {
            type: NotificationType.SCHEDULED,
            count: 2,
            scheduleType: "fixed",
            times: ["13:00", "18:30"],
            messages: [
              "سلام! وقتشه کمی به تجربه‌هات برگردی.",
              "یه دقیقه وقت بگذار و یکی از این موقعیت‌ها رو با جزئیات در ذهنت مرور کن.",
            ],
          },
        ],
        fields: [
          {
            id: "event_description",
            type: FieldType.TEXTAREA,
            label: "انتخاب رویداد اجتماعی",
            placeholder: "یکی از موقعیت‌های اجتماعی امروزت رو انتخاب کن...",
            required: true,
            order: 1,
          },
          {
            id: "mental_review_clarity",
            type: FieldType.SCALE,
            label: "چقدر تصویر ذهنی اون لحظه برات واضح بود؟",
            min: 1,
            max: 5,
            required: true,
            order: 2,
          },
          {
            id: "engagement_level",
            type: FieldType.SCALE,
            label: "چقدر احساس کردی درگیر اون لحظه بودی؟",
            min: 1,
            max: 5,
            required: true,
            order: 3,
          },
          {
            id: "others_presence",
            type: FieldType.SCALE,
            label: "حضور دیگران توی اون موقعیت برات چطور بود؟",
            min: 1,
            max: 5,
            required: true,
            order: 4,
          },
        ],
        completionMessage: "تمرین امروزت کامل شد، منتظر ارسال پیام‌های ما برای شروع تمرین بعدی باش.",
        isCustom: false,
        createdBy: "system",
      },
      {
        title: "ثبت رویدادهای تعاملی روزانه",
        groupType: GroupType.CONTROL,
        order: 4,
        description: "ذهن ما گاهی به‌جای دیدن واقعیت، با قضاوت‌ها و تفاسیرش به تجربه‌ها واکنش نشون می‌ده.",
        instructions: "به رویداد اجتماعی/تعاملی‌ای فکر کن که در چند ساعت گذشته تجربه کردی.",
        notifications: [
          {
            type: NotificationType.SCHEDULED,
            count: 3,
            scheduleType: "fixed",
            times: ["13:00", "18:00", "21:00"],
            messages: [
              "سلام! به رویداد اجتماعی/تعاملی‌ای فکر کن که در چند ساعت گذشته تجربه کردی.",
              "یه اتفاق اجتماعی دیگه رو یادآوری کن.",
              "الان وقتشه روزت رو مرور کنی.",
            ],
          },
        ],
        fields: [
          {
            id: "event_1",
            type: FieldType.TEXTAREA,
            label: "چه موقعیتی را تجربه کردی؟",
            placeholder: "فقط توضیح بده چه اتفاقی افتاد...",
            required: true,
            order: 1,
          },
          {
            id: "people_present",
            type: FieldType.TEXT,
            label: "چه کسانی در اون موقعیت حضور داشتن؟",
            required: true,
            order: 2,
          },
          {
            id: "attention_point",
            type: FieldType.TEXTAREA,
            label: "چه چیزی در اون موقعیت توجهت رو جلب کرد؟",
            required: false,
            order: 3,
          },
        ],
        completionMessage: "تمرین امروزت کامل شد، منتظر ارسال پیام‌های ما برای شروع تمرین بعدی باش.",
        isCustom: false,
        createdBy: "system",
      },
      {
        title: "پیش‌بینی مهم‌ترین رویداد تعاملی روز",
        groupType: GroupType.CONTROL,
        order: 5,
        description:
          "در ابتدای هر روز، می‌خواهیم به مهم‌ترین یا قابل‌توجه‌ترین رویداد اجتماعی یا بین‌فردی‌ای فکر کنی که احتمالاً در طول امروز تجربه خواهی کرد.",
        instructions: "امروز قراره چه رویداد اجتماعی‌ای برات مهم‌تر باشه؟",
        notifications: [
          {
            type: NotificationType.MORNING,
            count: 1,
            scheduleType: "user_time",
            messages: ["سلام! امروز قراره چه رویداد اجتماعی‌ای برات مهم‌تر باشه؟"],
          },
        ],
        fields: [
          {
            id: "event_name",
            type: FieldType.TEXT,
            label: "نام رویداد اجتماعی",
            placeholder: "امروز قرار است در چه موقعیت اجتماعی‌ای شرکت کنی؟",
            required: true,
            order: 1,
          },
          {
            id: "event_time",
            type: FieldType.TIME,
            label: "زمان رویداد",
            required: true,
            order: 2,
          },
          {
            id: "importance_reason",
            type: FieldType.TEXTAREA,
            label: "دلیل برجسته بودن",
            placeholder: "چرا این رویداد برای تو مهم یا قابل‌توجه است؟",
            required: true,
            order: 3,
          },
        ],
        completionMessage:
          "شما پنج تمرین اصلی خودپایشگری را با موفقیت پشت سر گذاشتید. از شما بابت همراهی و مشارکت صمیمانه‌تان در این پژوهش سپاس‌گزاریم.",
        isCustom: false,
        createdBy: "system",
      },
    ];

    // INTERVENTION GROUP EXERCISES
    const interventionExercises = [
      {
        title: "مزه‌مزه‌کردن لحظه‌های کوچک",
        groupType: GroupType.INTERVENTION,
        order: 1,
        description: "امروز قرار است تمرکزتان را روی لحظه‌هایی بگذارید که لذت‌بخش‌اند، نه اضطراب‌آور.",
        instructions: "برای چند دقیقه، روی یک تجربه ساده و خوشایند تمرکز کنید.",
        notifications: [
          {
            type: NotificationType.MORNING,
            count: 1,
            scheduleType: "user_time",
            messages: ["سلام! وقتشه لحظه‌ای برای لذت بردن از تجربه‌های کوچک امروز کنار بذاری."],
          },
        ],
        fields: [
          {
            id: "pleasant_moment",
            type: FieldType.TEXTAREA,
            label: "حضور در لحظه",
            placeholder: "چه چیزی را برای این تمرین انتخاب کردید؟",
            required: true,
            order: 1,
          },
          {
            id: "feeling_name",
            type: FieldType.TEXT,
            label: "نام‌گذاری احساسات",
            placeholder: "در لحظه چه احساسی داشتید؟",
            required: true,
            order: 2,
          },
          {
            id: "emotional_conflict",
            type: FieldType.TEXTAREA,
            label: "دیدن نوسانات هیجانی",
            placeholder: "چه تضاد یا مقاومتی را تجربه کردید؟",
            required: false,
            order: 3,
          },
        ],
        completionMessage:
          "تمرین امروزت کامل شد. آفرین به تو! همین لحظه‌های کوچک، قدم‌های بزرگی در مسیر تغییر هستن.",
        isCustom: false,
        createdBy: "system",
      },
      {
        title: "تجربه تضاد هیجانی در فعالیت اجتماعی خوشایند",
        groupType: GroupType.INTERVENTION,
        order: 2,
        description: "ما معمولاً وقتی از یک موقعیت اجتماعی خوشمان می‌آید، انتظار داریم فقط خوش بگذرد.",
        instructions: "یک فعالیت ساده‌ی اجتماعی انتخاب کن و آن را با توجه به احساساتت انجام بده.",
        notifications: [
          {
            type: NotificationType.MORNING,
            count: 1,
            scheduleType: "user_time",
            messages: ["آماده‌ای امروز یک قدم دیگه برداری؟"],
          },
        ],
        fields: [
          {
            id: "activity_choice",
            type: FieldType.TEXTAREA,
            label: "انتخاب فعالیت اجتماعی ساده",
            placeholder: "فعالیتی که انتخاب کردی چی بود؟",
            required: true,
            order: 1,
          },
          {
            id: "scheduled_time",
            type: FieldType.TIME,
            label: "تعیین زمان انجام تمرین",
            required: true,
            order: 2,
          },
          {
            id: "experience_feelings",
            type: FieldType.TEXTAREA,
            label: "انجام این فعالیت چه احساسی در شما ایجاد کرد؟",
            required: true,
            order: 3,
          },
          {
            id: "difficulty_level",
            type: FieldType.SCALE,
            label: "آیا تجربه‌ی احساس مثبت برایتان دشوار بود؟",
            min: 1,
            max: 5,
            required: true,
            order: 4,
          },
        ],
        completionMessage:
          "تمرین امروزت کامل شد. آفرین! تجربه کردن لذت، با همه‌ی تضادهایی که ممکنه بیاد، خودش یک مهارت مهمه.",
        isCustom: false,
        createdBy: "system",
      },
      {
        title: "پیش‌بینی مثبت پیش از یک تجربه اجتماعی",
        groupType: GroupType.INTERVENTION,
        order: 3,
        description: 'شاید تا حالا کمتر به این فکر کرده باشید که "اگه خوب پیش بره چی؟"',
        instructions:
          "وارد سایت شو و تمرین امروز رو انجام بده—قراره با هم تمرین کنیم که حتی قبل از شروع یه اتفاق اجتماعی، لذت و امید رو هم ببینیم.",
        notifications: [
          {
            type: NotificationType.MORNING,
            count: 1,
            scheduleType: "user_time",
            messages: ["سلام! امروز وقتشه یه جور دیگه به تجربه‌های اجتماعی فکر کنی."],
          },
        ],
        fields: [
          {
            id: "pleasant_activity",
            type: FieldType.TEXTAREA,
            label: "انتخاب فعالیت اجتماعی خوشایند",
            placeholder: "فعالیت انتخابی من...",
            required: true,
            order: 1,
          },
          {
            id: "positive_prediction",
            type: FieldType.TEXTAREA,
            label: "پیش‌بینی مثبت درباره‌ی این تجربه",
            placeholder: "اگر این تجربه لذت‌بخش باشه، چه احساسی خواهم داشت؟",
            required: true,
            order: 2,
          },
          {
            id: "actual_feeling",
            type: FieldType.TEXTAREA,
            label: "بعدش، حس‌هات مطابق انتظارت بود؟",
            required: true,
            order: 3,
          },
        ],
        completionMessage: "تمرین امروزت هم به پایان رسید. کارت عالی بود!",
        isCustom: false,
        createdBy: "system",
      },
      {
        title: "تمرکز روی لحظه‌های خوشایند اجتماعی",
        groupType: GroupType.INTERVENTION,
        order: 4,
        description: "ما معمولاً به لحظه‌های منفی سریع واکنش نشان می‌دهیم، اما لحظه‌های خوب، زود می‌گذرند.",
        instructions: "یادت نره امروز ممکنه لحظه‌هایی باشن که باعث بشن حس خوبی پیدا کنی—حتی وسط اضطراب.",
        notifications: [
          {
            type: NotificationType.RANDOM,
            count: 2,
            scheduleType: "random",
            timeRanges: [
              { start: "12:00", end: "14:00" },
              { start: "17:00", end: "19:00" },
            ],
            messages: [
              "اگه الان در یک جمع هستی یا با کسی در گفت‌وگویی، ببین آیا حتی یه لحظه احساس خوبی داشتی؟",
              "ممکنه حس خوبی رو تجربه کنی و ذهنت بخواد با نگرانی یا شک اون رو قطع کنه.",
            ],
          },
        ],
        fields: [
          {
            id: "pleasant_moment_today",
            type: FieldType.TEXTAREA,
            label: "امروز چه لحظه‌ای در تعامل اجتماعی برات لذت‌بخش بود؟",
            required: true,
            order: 1,
          },
          {
            id: "moment_feeling",
            type: FieldType.TEXT,
            label: "اون لحظه چه احساسی داشتی؟",
            required: true,
            order: 2,
          },
          {
            id: "mind_interruption",
            type: FieldType.TEXTAREA,
            label: "آیا ذهنت تلاش کرد اون حس خوب رو قطع کنه یا کم‌اهمیت نشون بده؟",
            required: false,
            order: 3,
          },
        ],
        completionMessage:
          "تمرین امروزت به پایان رسید. اگر حتی برای چند ثانیه تونستی روی یک حس خوب تمرکز کنی، یعنی قدم مهمی برداشتی.",
        isCustom: false,
        createdBy: "system",
      },
      {
        title: "شمارش موفقیت‌های کوچک اجتماعی",
        groupType: GroupType.INTERVENTION,
        order: 5,
        description: "گاهی بعد از یک تجربه اجتماعی، ذهن‌مون سریع می‌ره سراغ اشتباه‌ها یا نگرانی‌ها.",
        instructions: "وقتشه به لحظات خوبی که امروز توی تعاملات اجتماعیت داشتی نگاه بندازی.",
        notifications: [
          {
            type: NotificationType.RANDOM,
            count: 2,
            scheduleType: "random",
            timeRanges: [
              { start: "12:00", end: "14:00" },
              { start: "17:00", end: "19:00" },
            ],
            messages: [
              "اگر در رویدادی احساس خوبی داشتی، لحظه‌ای در اون بمون—حتی اگر ذهن‌ت خواست حواست رو پرت کنه.",
              "امروز چند دقیقه وقت بذار و ببین چه چیزهایی بهتر از انتظارت پیش رفتن.",
            ],
          },
        ],
        fields: [
          {
            id: "social_event_today",
            type: FieldType.TEXTAREA,
            label: "امروز چه رویداد اجتماعی‌ای داشتی؟",
            required: true,
            order: 1,
          },
          {
            id: "pleasant_part",
            type: FieldType.TEXTAREA,
            label: "کدام بخش این رویداد برایت لذت‌بخش بود؟",
            required: true,
            order: 2,
          },
          {
            id: "good_action",
            type: FieldType.TEXTAREA,
            label: "چه کاری انجام دادی که به نظرت خوب بود؟",
            required: true,
            order: 3,
          },
          {
            id: "negative_thoughts",
            type: FieldType.TEXTAREA,
            label: "آیا موقع یادآوری بخش‌های خوب، افکار منفی یا اضطراب داشتی؟",
            required: false,
            order: 4,
          },
        ],
        completionMessage:
          "آفرین! امروز با خودت مهربون‌تر بودی و لحظه‌های خوبت رو دیدی. یادگیری نگه داشتن حس‌های مثبت هم تمرین می‌خواد.",
        isCustom: false,
        createdBy: "system",
      },
    ];

    // Insert all exercises
    await ExerciseTemplate.insertMany([...controlExercises, ...interventionExercises]);
    console.log("✅ Default exercises seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding exercises:", error);
    throw error;
  }
};
