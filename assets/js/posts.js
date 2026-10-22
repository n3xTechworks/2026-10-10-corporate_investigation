/* Blog articles for blog-post.html?post=<slug>.
   "cross-border-ma" is the static article already in blog-post.html (also shown when no slug is given). */
(function () {
  'use strict';

  var AUTHORS = {
    voss: { name: 'Nathaniel Voss', role: 'Managing Partner', img: 'assets/img/people/team-1.webp', bio: 'Nathaniel founded Calder Voss after two decades in corporate investigations. He advises boards and counsel on transactions where ownership and reputation decide the outcome.' },
    reyes: { name: 'Daniel Reyes', role: 'Senior Associate, Corporate Investigations', img: 'assets/img/people/author-1.webp', bio: 'Daniel leads counterparty and integrity diligence for acquirers on cross-border transactions. He writes on ownership structures, intermediaries and deal risk.' },
    calder: { name: 'Marcus Calder', role: 'Director, Forensic Accounting', bio: 'Marcus is a chartered accountant who leads our forensic and data work. He has examined ledgers, data rooms and payment flows in more than 30 jurisdictions.' },
    nair: { name: 'Priya Nair', role: 'Head of Vetting', bio: 'Priya runs executive and board-level vetting. She focuses on proportionate checks that are lawful, documented and fair to the person being screened.' },
    hart: { name: 'Daniel Hart', role: 'Associate Director, ESG Diligence', bio: 'Daniel tests sustainability and supply-chain claims for investors. He previously worked in environmental compliance for an industrial group.' }
  };

  var POSTS = {
    'cross-border-ma': { title: 'Cross-border M&amp;A: the five questions that surface hidden liabilities', short: 'Cross-border M&amp;A', topic: 'Due Diligence', anchor: 'due-diligence', date: '2 Oct 2026', static: true },
    'beneficial-ownership': {
      title: 'Beneficial-ownership disclosure is tightening. What acquirers should change <span class="redact">now</span>',
      short: 'Beneficial-ownership disclosure is tightening', crumb: 'Beneficial ownership', topic: 'Regulation', anchor: 'regulation',
      date: '14 Oct 2026', iso: '2026-10-14', long: '14 October 2026', read: '8 min read', author: 'voss',
      img: 'assets/img/blog/post-1.webp', imgAlt: 'Looking up between tall stone columns towards a coffered ceiling',
      caption: 'Public registers are getting deeper. Reading them well is now part of basic diligence.',
      lead: 'Registers of beneficial owners are becoming more public, more detailed and more widely linked across borders. That is good news for acquirers, but only for teams that know what the registers can and cannot tell them.',
      body: '<h2>1. What is changing</h2><p>More jurisdictions now require companies to record the individuals who ultimately own or control them, and more of those records are open to people with a legitimate interest. Thresholds are falling, penalties for late or false filings are rising, and registries are beginning to cross-check their data against tax and banking records.</p><p>For an acquirer, this means a first view of the ownership chain is often available within hours rather than weeks. It also means that gaps and inconsistencies are easier to spot, and harder to explain away later.</p>' +
        '<h2>2. Where the gaps still sit</h2><p>A register is only as good as what was filed. Trusts, nominee arrangements and companies in jurisdictions without open registers can still break the chain. Filings can be late, out of date or simply wrong, and few registries verify what they receive.</p><h3>Signals worth testing</h3><ul><li>Ownership that stops at a corporate entity in a jurisdiction with no public register.</li><li>A beneficial owner whose name, address or date of birth does not match other public records.</li><li>Recent changes to the register shortly before a sale process began.</li><li>Control rights, such as vetoes or board appointments, held by parties not listed as owners.</li></ul>' +
        '<blockquote>A register entry is a statement made by the company about itself. Treat it as a lead to verify, not as the answer.<cite>Nathaniel Voss, Managing Partner</cite></blockquote>' +
        '<h2>3. What acquirers should change now</h2><p>Make register checks the opening step of every counterparty review, not a box ticked at the end. Compare what the registers show with the seller&rsquo;s own ownership chart, and ask for an explanation of every difference before exclusivity.</p><p>Where a layer of ownership cannot be seen, decide early whether the gap matters for this deal. Sometimes it is an ordinary holding structure. Sometimes it is the point at which sanctions, corruption or undisclosed related parties enter the picture.</p>' +
        '<h2>4. Document the trail</h2><p>Regulators and lenders increasingly expect buyers to show how they reached their view of ownership. Keep a dated record of every register searched, what it showed and how each discrepancy was resolved. That record is also the starting point for post-closing monitoring.</p>' +
        '<h2>What to do next</h2><p>If a transaction depends on knowing who sits at the top of the chain, our <a href="services.html">M&amp;A due diligence</a> team can map and verify ownership across registries and languages. <a href="contact.html">Contact us</a> to discuss scope in confidence.</p>',
      takeaways: ['Start every counterparty review with the beneficial-ownership registers.', 'Reconcile register data with the seller&rsquo;s own ownership chart.', 'Treat missing layers as a decision point, not a footnote.', 'Keep a dated record of every search and how gaps were resolved.']
    },
    'ledgers': {
      title: 'When the numbers look too tidy: reading a target&rsquo;s <span class="redact">ledgers</span>',
      short: 'When the numbers look too tidy', crumb: 'Reading the ledgers', topic: 'Fraud &amp; Risk', anchor: 'fraud-risk',
      date: '18 Sep 2026', iso: '2026-09-18', long: '18 September 2026', read: '7 min read', author: 'calder',
      img: 'assets/img/blog/post-3.webp', imgAlt: 'Tall stacks of paper files and folders on office desks',
      caption: 'Fraud rarely hides in the summary. It sits in the detail of the journal entries.',
      lead: 'Clean accounts are what every seller wants to show. Forensic accountants are trained to be curious when the numbers are cleaner than the business that produced them.',
      body: '<h2>1. Round numbers and perfect patterns</h2><p>Real transactions are messy. Invoices carry odd amounts, payments arrive late and margins move with the seasons. When revenue lands in round figures, or margins stay identical quarter after quarter, it is worth asking how.</p><p>We compare the distribution of amounts in the ledger with what would be expected for a business of that type. Unusual clusters just under approval limits, or an excess of round values, are prompts for closer testing.</p>' +
        '<h2>2. Late and manual journal entries</h2><p>Entries posted after the period closed, by senior staff, or outside the normal system workflow deserve attention. Most have an innocent explanation. A few move revenue between periods or hide costs that would otherwise reduce the price.</p><h3>What we test first</h3><ul><li>Entries posted on weekends, holidays or in the days after a period ends.</li><li>Manual adjustments to revenue, reserves and intercompany balances.</li><li>Entries made by users who do not normally post to those accounts.</li><li>Reversals early in the next period of entries made at year end.</li></ul>' +
        '<blockquote>The question is never whether a ledger contains adjustments. It is whether each one has a reason, an approver and a document behind it.<cite>Marcus Calder, Director, Forensic Accounting</cite></blockquote>' +
        '<h2>3. Vendors that should not be there</h2><p>A small number of suppliers can tell a large story. Vendors that share an address or bank account with an employee, that were created shortly before large payments, or that supply services nobody can describe are classic signals of leakage.</p><h2>4. Cash tells the truth</h2><p>Profit can be shaped; cash is harder to fake. Reconcile reported revenue with bank receipts, and compare receivables ageing with what customers actually paid. Persistent gaps between the two are one of the clearest warnings a diligence team can find.</p>' +
        '<h2>What to do next</h2><p>Our <a href="services.html">forensic accounting</a> work is designed to run alongside financial diligence without slowing the deal. <a href="contact.html">Speak to a partner</a> if a target&rsquo;s numbers look a little too good.</p>',
      takeaways: ['Look for round figures and unnaturally steady margins.', 'Test late, manual and unusual journal entries first.', 'Screen the vendor master file for links to employees.', 'Reconcile reported revenue with actual cash received.']
    },
    'executive-vetting': {
      title: 'Executive vetting beyond the CV: what a proportionate check <span class="redact">covers</span>',
      short: 'Executive vetting beyond the CV', crumb: 'Executive vetting', topic: 'Vetting', anchor: 'vetting',
      date: '3 Sep 2026', iso: '2026-09-03', long: '3 September 2026', read: '5 min read', author: 'nair',
      img: 'assets/img/blog/post-4.webp', imgAlt: 'People silhouetted against a large airport window at sunset',
      caption: 'A senior appointment is a judgement about a person. Good vetting gives that judgement facts.',
      lead: 'Boards appointing a chief executive, a director or a key hire need more than a polished CV. They need a proportionate check that confirms the basics and looks further only where the role and the findings justify it.',
      body: '<h2>1. The baseline every check should cover</h2><p>Start with what can be verified: identity, education, professional qualifications, employment history and directorships. Confirm each one directly with the issuing body or public registry, not with documents supplied by the candidate.</p><ul><li>Degrees and professional memberships confirmed with the institution.</li><li>Current and past directorships, and the fate of those companies.</li><li>Litigation, insolvency and regulatory records in each jurisdiction lived or worked in.</li><li>Sanctions and politically exposed person screening.</li></ul>' +
        '<h2>2. When to go further</h2><p>For roles with control over money, people or reputation, a wider view is often justified. Discreet conversations with former colleagues, a review of media coverage in the relevant languages and a look at how previous businesses ended can all add context that records alone cannot.</p>' +
        '<blockquote>Proportionate does not mean light. It means the depth of the check matches the weight of the role.<cite>Priya Nair, Head of Vetting</cite></blockquote>' +
        '<h2>3. Fairness and the law</h2><p>Vetting must be lawful in every jurisdiction involved, and the candidate should know it is taking place. Use only relevant information, record the basis for each step and give the person a chance to explain anything adverse before a decision is made.</p><h2>4. Reporting that helps a board decide</h2><p>A good report separates verified facts from opinion, flags what could not be confirmed and explains why each finding matters for this role. It should be short enough to read before the meeting.</p>' +
        '<h2>What to do next</h2><p>Our <a href="services.html">background checks</a> are scoped to the role, with clear reporting for boards and search firms. <a href="contact.html">Contact us</a> before your next senior appointment.</p>',
      takeaways: ['Verify credentials directly with the issuing body.', 'Match the depth of the check to the weight of the role.', 'Keep vetting lawful, transparent and documented.', 'Give the candidate a chance to explain adverse findings.']
    },
    'esg-supply-chain': {
      title: 'Testing sustainability claims in the supply <span class="redact">chain</span>',
      short: 'Testing sustainability claims', crumb: 'ESG supply chain', topic: 'ESG', anchor: 'esg',
      date: '20 Aug 2026', iso: '2026-08-20', long: '20 August 2026', read: '6 min read', author: 'hart',
      img: 'assets/img/blog/post-5.webp', imgAlt: 'A wind turbine rising above low cloud at dawn',
      caption: 'Claims about a supply chain are only as strong as the evidence from the sites themselves.',
      lead: 'When a target&rsquo;s ESG story drives its valuation, buyers need to know which claims are documented practice and which are marketing language. The supply chain is usually where the difference shows.',
      body: '<h2>1. Start with the claims that move the price</h2><p>List every sustainability statement in the information memorandum and the target&rsquo;s public reports. Rank them by how much they affect revenue, cost of capital or customer contracts. Those at the top of the list deserve independent evidence.</p>' +
        '<h2>2. Follow the goods, not the policy</h2><p>A supplier code of conduct proves that a policy exists. It does not prove that suppliers follow it. Trace key inputs back through tier-one and tier-two suppliers and look for evidence from the sites: audit reports, certifications and shipping records that match.</p><ul><li>Certificates that have expired or cover a different site.</li><li>Audits announced weeks in advance or carried out by related parties.</li><li>Volumes of certified material that exceed what the certified supplier produces.</li></ul>' +
        '<blockquote>Sustainability claims should be tested like any other representation in a deal: by asking for the evidence behind them.<cite>Daniel Hart, Associate Director, ESG Diligence</cite></blockquote>' +
        '<h2>3. Speak to people on the ground</h2><p>Local researchers, former employees and community groups can confirm whether labour and environmental practices match the paperwork. This work must be done carefully and lawfully, with attention to the safety of everyone involved.</p><h2>4. Turn findings into deal terms</h2><p>Gaps do not always end a deal. They can support specific warranties, remediation plans with milestones or price adjustments linked to verified performance.</p>' +
        '<h2>What to do next</h2><p>Our <a href="services.html">compliance reviews</a> test ESG claims with site-level evidence. <a href="contact.html">Speak to us</a> before the claims become part of your own reporting.</p>',
      takeaways: ['Rank ESG claims by their effect on value.', 'Trace key inputs to site-level evidence.', 'Check certificates, audits and volumes for consistency.', 'Use findings to shape warranties and remediation plans.']
    },
    'data-room-hygiene': {
      title: 'Data-room hygiene: protecting a deal while it is still <span class="redact">confidential</span>',
      short: 'Data-room hygiene while a deal is confidential', crumb: 'Data-room hygiene', topic: 'Cyber &amp; Data', anchor: 'cyber-data',
      date: '6 Aug 2026', iso: '2026-08-06', long: '6 August 2026', read: '7 min read', author: 'calder',
      img: 'assets/img/blog/post-6.webp', imgAlt: 'A dark glass-walled data-hall corridor lit by strip lights',
      caption: 'The data room holds the most sensitive version of the company. Treat access to it accordingly.',
      lead: 'A virtual data room holds contracts, payroll, customer lists and board papers in one place, often months before a deal is announced. Simple controls keep that material from becoming the next incident.',
      body: '<h2>1. Give access by need, not by title</h2><p>Set up folders by workstream and give each adviser access only to what they need. Review permissions every week, and remove people as soon as their part of the work is done.</p>' +
        '<h2>2. Watermark and log everything</h2><p>Dynamic watermarks that show the viewer&rsquo;s name and the time discourage screenshots and make leaks traceable. Access logs show who opened what and when; read them, rather than keeping them only for after a problem.</p><ul><li>Unusual bulk downloads, especially late in a process.</li><li>Access from new locations or devices.</li><li>Bidders viewing folders unrelated to their stated interest.</li></ul>' +
        '<blockquote>Most leaks are not sophisticated. They are a forwarded file or a shared password that nobody thought to revoke.<cite>Marcus Calder, Director, Forensic Accounting</cite></blockquote>' +
        '<h2>3. Stage the most sensitive material</h2><p>Release customer names, pricing and personal data only to the final bidders, and only once they have signed specific confidentiality terms. Clean-team arrangements let a buyer&rsquo;s advisers review competitively sensitive data without passing it to the business.</p><h2>4. Plan for the bad day</h2><p>Agree in advance who decides what happens if a leak is suspected, how evidence is preserved and when regulators or counterparties must be told.</p>' +
        '<h2>What to do next</h2><p>We help sellers and buyers review data-room controls and investigate suspected leaks. <a href="contact.html">Contact us</a> in confidence.</p>',
      takeaways: ['Grant data-room access by workstream and review it weekly.', 'Use dynamic watermarks and read the access logs.', 'Release the most sensitive material in stages.', 'Agree a leak response plan before you need it.']
    },
    'asset-tracing': {
      title: 'Asset tracing after a fraud: following the money across <span class="redact">borders</span>',
      short: 'Asset tracing after a fraud', crumb: 'Asset tracing', topic: 'Asset Tracing', anchor: 'asset-tracing',
      date: '22 Jul 2026', iso: '2026-07-22', long: '22 July 2026', read: '6 min read', author: 'reyes',
      img: 'assets/img/blog/post-7.webp', imgAlt: 'A magnifying glass resting on a handwritten ledger beside a map',
      caption: 'Recovery starts with a clear map of where the money went, and who now controls it.',
      lead: 'When money has been taken, speed matters. Assets move quickly between accounts, companies and countries, and the window to freeze them can be short. A structured tracing plan gives counsel the evidence they need to act.',
      body: '<h2>1. Secure what you already know</h2><p>Start with the victim&rsquo;s own records: bank statements, payment instructions, emails and system logs. Preserve them properly so they can be used in court, and build a timeline of every transfer out of the business.</p>' +
        '<h2>2. Follow each transfer to the next owner</h2><p>For every payment, identify the receiving account, the company or person behind it and what happened to the money next. Public registries, property records, court filings and corporate databases in each jurisdiction help fill the gaps.</p><ul><li>Companies formed shortly before the payments were made.</li><li>Property, vehicles or vessels bought soon after the funds arrived.</li><li>Family members or associates appearing as new directors or owners.</li></ul>' +
        '<blockquote>Every transfer leaves a trace somewhere. The skill is knowing which registry, in which language, will show it.<cite>Daniel Reyes, Senior Associate</cite></blockquote>' +
        '<h2>3. Work hand in hand with counsel</h2><p>Tracing is most effective when it supports a legal strategy. Freezing orders, disclosure orders against banks and recognition of judgments abroad all depend on evidence gathered lawfully and presented clearly.</p><h2>4. Think about recovery early</h2><p>Not every asset is worth pursuing. Weigh the value, the jurisdiction and the cost of enforcement so that effort goes where recovery is realistic.</p>' +
        '<h2>What to do next</h2><p>Our <a href="services.html">asset tracing and recovery</a> team works alongside litigation counsel from the first day. <a href="contact.html">Contact us</a> as soon as a loss is discovered.</p>',
      takeaways: ['Preserve the victim&rsquo;s records and build a transfer timeline.', 'Follow each payment to the next owner and asset.', 'Gather evidence lawfully to support freezing orders.', 'Focus effort where recovery is realistic.']
    }
  };
  var ORDER = ['beneficial-ownership', 'cross-border-ma', 'ledgers', 'executive-vetting', 'esg-supply-chain', 'data-room-hygiene', 'asset-tracing'];

  function href(slug) { return 'blog-post.html?post=' + slug; }
  function plain(html) { var d = document.createElement('div'); d.innerHTML = html; return d.textContent; }
  function $(s, r) { return (r || document).querySelector(s); }

  var slug = new URLSearchParams(location.search).get('post');
  if (!POSTS[slug]) slug = 'cross-border-ma';
  var post = POSTS[slug];

  if (!post.static) {
    var a = AUTHORS[post.author];
    document.title = plain(post.title) + ' | Calder Voss';
    var desc = $('meta[name="description"]'); if (desc) desc.setAttribute('content', plain(post.lead));
    var crumb = $('.breadcrumb [aria-current="page"]'); if (crumb) crumb.innerHTML = post.crumb;
    var eyebrow = $('.page-banner .eyebrow'); if (eyebrow) eyebrow.innerHTML = post.topic + ' · Article';
    var h1 = $('#article-title'); if (h1) h1.innerHTML = post.title;
    var meta = $('.page-banner .article-meta');
    if (meta) meta.innerHTML = '<span class="tag">' + post.topic + '</span><time datetime="' + post.iso + '">' + post.long + '</time><span>' + post.read + '</span><span>By ' + a.name + '</span>';
    var prose = $('.prose');
    if (prose) prose.innerHTML = '<p class="lead">' + post.lead + '</p>' +
      '<figure><div class="media ratio-20-13"><img src="' + post.img + '" alt="' + post.imgAlt + '" width="800" height="520" loading="lazy" decoding="async"></div><figcaption>' + post.caption + '</figcaption></figure>' + post.body;
    var take = $('#takeaways-title + .checklist');
    if (take) take.innerHTML = post.takeaways.map(function (t) { return '<li>' + t + '</li>'; }).join('');
    var box = $('.author-box');
    if (box) {
      var img = $('.avatar', box);
      if (a.img) { img.src = a.img; img.alt = 'Portrait of ' + a.name; }
      else {
        var ini = document.createElement('span');
        ini.className = 'avatar avatar-initials'; ini.setAttribute('aria-hidden', 'true');
        ini.textContent = a.name.split(' ').map(function (w) { return w.charAt(0); }).join('');
        img.replaceWith(ini);
      }
      $('.author-name', box).textContent = a.name;
      $('.role', box).textContent = a.role;
      $('.role + p', box).textContent = a.bio;
    }
    var url = encodeURIComponent('https://www.caldervoss.com/' + href(slug));
    var text = encodeURIComponent(plain(post.title));
    document.querySelectorAll('.social a').forEach(function (l) {
      var h = l.getAttribute('href');
      if (h.indexOf('linkedin') > -1) l.href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + url;
      else if (h.indexOf('x.com') > -1) l.href = 'https://x.com/intent/post?text=' + text + '&url=' + url;
      else if (h.indexOf('mailto:') === 0) l.href = 'mailto:?subject=' + text + '&body=' + url;
    });
  }

  /* Related reading: the three most recent other articles */
  var related = $('.widget-list');
  if (related) related.innerHTML = ORDER.filter(function (s) { return s !== slug; }).slice(0, 3).map(function (s) {
    var p = POSTS[s]; return '<li><a href="' + href(s) + '">' + p.short + '<small>' + p.date + ' · ' + p.topic + '</small></a></li>';
  }).join('');

  /* Topics: each chip opens that topic's article; the current topic is marked */
  document.querySelectorAll('aside .tag-list .tag').forEach(function (chip) {
    var anchor = (chip.getAttribute('href') || '').split('#')[1];
    for (var s in POSTS) if (POSTS[s].anchor === anchor) {
      chip.href = href(s);
      if (s === slug) chip.setAttribute('aria-current', 'page');
    }
  });

  /* Previous (older) / next (newer) article */
  var i = ORDER.indexOf(slug), cards = document.querySelectorAll('[aria-label="Previous and next articles"] .card');
  [[cards[0], ORDER[i + 1], 'Previous article'], [cards[1], ORDER[i - 1], 'Next article']].forEach(function (c) {
    if (!c[0]) return;
    if (!c[1]) { c[0].style.visibility = 'hidden'; return; }
    var p = POSTS[c[1]];
    c[0].querySelector('.card-title a').innerHTML = p.short;
    c[0].querySelector('.card-title a').href = href(c[1]);
    c[0].querySelector('.card-text').innerHTML = p.date + ' · ' + p.topic;
  });
})();
