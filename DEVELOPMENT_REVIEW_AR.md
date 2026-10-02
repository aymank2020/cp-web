# مراجعة cp-web وخطة التطوير

<!-- review-metadata -->
تاريخ المراجعة: 2026-10-02. الفرع المحلي: `codex/review-develop-2026-10-02`.

المصدر: [aymank2020/cp-web](https://github.com/aymank2020/cp-web)؛ commit الأساس: `74f1e84eb34a92c1b0ea7a216e3e582fd5573c5d`؛ عدد الملفات المتتبعة في الأساس: 2354. Fork: true؛ مؤرشف: false.

نُفذت المرحلة المحددة أدناه بعد مراجعة الكود والاختبارات وتطبيق مراجعة التكامل والأثر؛ المراحل التالية والفجوات لا تُعد مكتملة.

نموذج IBM Commercial Paper بترخيص Apache2.0. README الأصلي يحدد Fabric0.6 فقط، مع HFC0.6.5 وNode6 ومصادر تاريخية كثيرة؛ المثال ليس تطبيق تداول صالحًا للنشر اليوم. فُحصت app.js والمسارات والمساعدات والواجهات، دون تشغيل شبكة مالية أو قراءة قيم ملف الاعتماد.

## التنفيذ الحالي

- إزالة التعطيل العام للتحقق من TLS؛ توصيل CA الموجود بطلب chain stats فقط.
- فصل إعداد runtime وفحص `SESSION_SECRET` بطول32حرفًا على الأقل قبل تحميل SDK أو أي اتصال. رفض `NODE_TLS_REJECT_UNAUTHORIZED=0`.
- cookies بـhttpOnly، وsecure في production، وsaveUninitialized=false، وtrustProxy باختيار صريح `TRUST_PROXY=1` خلف proxy موثوق.
- إرسال رسالة عامة بدل stack trace للإنتاج، واحترام عنوان host في listen، وتعطيل telemetry افتراضيًا حتى `TRACK_DEPLOYMENT=1`.
- إزالة mycreds.json من التتبع مع إبقاء النسخة المحلية وتجاهلها مستقبلًا. لا تمحو هذه الخطوة نسخه من تاريخ Git.

## خطة المراحل التالية

1. تدقيق صلاحيات المستخدم والأدوار، وCSRF ومخزن جلسات إنتاجي؛ MemoryStore الأصلي ليس خيار إنتاج. تدوير أي اعتماد سبق نشره لدى مزوده.
2. بناء بديل isolated من نموذج Commercial Paper الرسمي على Fabric مدعوم، مع Gateway وعقد issue/buy/redeem، وبيانات وشبكة اختبار؛ ليس تحديث npm مباشرًا لنظام0.6.
3. اختبار دورة التعامل كاملة وتفويض Auditor/Trader وتسوية الأخطاء قبل أي تجربة مع بيانات مالية حقيقية.

## التكامل والتحقق

المسار: app.js → runtime-config → express-session/listen/HTTPS. `npm test` نجح لفشل السر المفقود والقصير وTLS المعطل وإعدادات production/proxy/telemetry، ويشغّل app.js فعليًا بلا سر ليثبت فشل الإعداد قبل SDK والشبكة. `node --check` اجتاز الملفين. لا تشغيل كامل للخادم أو Fabric؛ تبقى عقود0.6 والمصادقة التاريخية وNode6 والمكتبات القديمة فجوات كبيرة. لبدء اختبار محلي مُجهّز يلزم سر جلسة من مدير أسرار، وعدم استخدام ملف الاعتماد المنشور تاريخيًا.

## مصادر أولية

- [Hyperledger: Commercial Paper](https://hyperledger-fabric.readthedocs.io/en/release-2.2/tutorial/commercial_paper.html)
- [Express: إعداد الجلسات وcookies وproxy](https://expressjs.com/en/resources/middleware/session/)
- [Node: NODE_TLS_REJECT_UNAUTHORIZED](https://nodejs.org/api/cli.html#node_tls_reject_unauthorizedvalue)
- [GitHub: إزالة البيانات الحساسة](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
