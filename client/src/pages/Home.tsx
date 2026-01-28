import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, Target, Zap, Shield, DollarSign, AlertCircle, CheckCircle, TrendingDown } from "lucide-react";

// Market data
const marketGrowthData = [
  { year: "2024", "AI Healthcare": 26.57, "Virtual Nursing": 1.03, "Elderly Care": 53.29 },
  { year: "2025", "AI Healthcare": 32.1, "Virtual Nursing": 1.5, "Elderly Care": 57.78 },
  { year: "2026", "AI Healthcare": 38.8, "Virtual Nursing": 2.1, "Elderly Care": 65.2 },
  { year: "2030", "AI Healthcare": 65.4, "Virtual Nursing": 3.2, "Elderly Care": 95.6 },
  { year: "2034", "AI Healthcare": 120.3, "Virtual Nursing": 4.1, "Elderly Care": 114.57 },
];

const stakeholderData = [
  { name: "Nurses/Caregivers", value: 35, color: "#3b82f6" },
  { name: "Family Members", value: 30, color: "#8b5cf6" },
  { name: "Doctors", value: 20, color: "#ec4899" },
  { name: "Agencies", value: 15, color: "#f59e0b" },
];

const swotData = [
  { category: "Strengths", count: 4, icon: "✓", color: "bg-green-50 border-green-200" },
  { category: "Weaknesses", count: 3, icon: "!", color: "bg-yellow-50 border-yellow-200" },
  { category: "Opportunities", count: 4, icon: "⚡", color: "bg-blue-50 border-blue-200" },
  { category: "Threats", count: 3, icon: "⚠", color: "bg-red-50 border-red-200" },
];

const documentationTime = [
  { activity: "Before AI", time: 6 },
  { activity: "With CareNarrative", time: 0.75 },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CN</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">CareNarrative AI</h1>
              <p className="text-xs text-slate-500">Market Analysis & Strategy</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-blue-50">Healthcare Tech</Badge>
            <Badge variant="outline" className="bg-purple-50">AI-Powered</Badge>
          </div>
        </div>
      </header>

      <main className="container py-12 space-y-16">
        {/* Hero Section */}
        <section className="space-y-6">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">
              Transforming Elderly Care Through AI-Powered Reporting
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              CareNarrative AI streamlines health documentation for nurses and caregivers while providing families and doctors with structured, actionable insights. This analysis explores market opportunities, competitive positioning, and growth strategies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Market Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-700">4.1B</p>
                <p className="text-xs text-blue-600">Virtual Nursing by 2034</p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-purple-900 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Time Savings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-700">85%</p>
                <p className="text-xs text-purple-600">Documentation time reduction</p>
              </CardContent>
            </Card>

            <Card className="border-pink-200 bg-pink-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-pink-900 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Caregiver Crisis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-pink-700">25%</p>
                <p className="text-xs text-pink-600">Patients turned away due to shortages</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Market Overview */}
        <section className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Market Landscape</h3>
            <p className="text-slate-600">The elderly care and AI healthcare markets are experiencing explosive growth, driven by demographic shifts and workforce shortages.</p>
          </div>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Market Size Projections ($ Billions)</CardTitle>
              <CardDescription>AI in Healthcare, Virtual Nursing, and Elderly Care sectors</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={marketGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
                    formatter={(value) => `$${value}B`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="AI Healthcare" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} />
                  <Line type="monotone" dataKey="Virtual Nursing" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6" }} />
                  <Line type="monotone" dataKey="Elderly Care" stroke="#ec4899" strokeWidth={2} dot={{ fill: "#ec4899" }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* Stakeholder Analysis */}
        <section className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Stakeholder Ecosystem</h3>
            <p className="text-slate-600">CareNarrative AI serves four distinct stakeholder groups with unique needs and pain points.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Stakeholder Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={stakeholderData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stakeholderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-3">
              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Primary Users: Nurses & Caregivers
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-blue-800">
                  <p><strong>Pain Points:</strong> Documentation burden, burnout (41% report low well-being), medication management complexity.</p>
                  <p className="mt-2"><strong>Value:</strong> 85% reduction in paperwork, more time for patient care.</p>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-purple-900 flex items-center gap-2">
                    <Target className="w-4 h-4" /> End Beneficiaries: Elderly Patients
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-purple-800">
                  <p><strong>Needs:</strong> Consistent monitoring, medication adherence, safety (fall prevention), aging in place.</p>
                  <p className="mt-2"><strong>Value:</strong> Better care quality, improved health outcomes.</p>
                </CardContent>
              </Card>

              <Card className="border-pink-200 bg-pink-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-pink-900 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Decision-Makers: Family & Guardians
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-pink-800">
                  <p><strong>Concerns:</strong> Peace of mind, transparency, financial strain (25% take on debt).</p>
                  <p className="mt-2"><strong>Value:</strong> Real-time health updates, cost-effective monitoring.</p>
                </CardContent>
              </Card>

              <Card className="border-amber-200 bg-amber-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-amber-900 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Secondary: Doctors & Clinicians
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-amber-800">
                  <p><strong>Requirements:</strong> Structured clinical data, HIPAA compliance, continuity of care.</p>
                  <p className="mt-2"><strong>Value:</strong> Standardized reports, informed decision-making.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Business Frameworks */}
        <section className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Strategic Analysis Frameworks</h3>
            <p className="text-slate-600">Comprehensive analysis using industry-standard business models.</p>
          </div>

          <Tabs defaultValue="swot" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="swot">SWOT</TabsTrigger>
              <TabsTrigger value="bmc">BMC</TabsTrigger>
              <TabsTrigger value="pestel">PESTEL</TabsTrigger>
              <TabsTrigger value="7ps">7Ps</TabsTrigger>
            </TabsList>

            {/* SWOT Analysis */}
            <TabsContent value="swot" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-green-200 bg-green-50/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-900 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" /> Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span><strong>85% time reduction:</strong> Automation cuts documentation from 6 mins to {'<'}1 min per patient</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span><strong>HIPAA-compliant:</strong> Structured data meets regulatory requirements</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span><strong>Specialized focus:</strong> Tailored for home healthcare workflows</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span><strong>Multi-stakeholder value:</strong> Addresses caregivers, families, and doctors simultaneously</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-yellow-200 bg-yellow-50/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-yellow-900 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" /> Weaknesses
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex gap-2">
                      <span className="text-yellow-600 font-bold">•</span>
                      <span><strong>AI accuracy dependency:</strong> Requires continuous model refinement and validation</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-600 font-bold">•</span>
                      <span><strong>Digital literacy barriers:</strong> Caregivers may struggle with technology adoption</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-yellow-600 font-bold">•</span>
                      <span><strong>High compliance costs:</strong> Ongoing HIPAA audits and security infrastructure</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" /> Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span><strong>Aging population surge:</strong> 24% of US adults are caregivers; growing demand for elderly care</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span><strong>Workforce shortage:</strong> 25% of patients turned away; agencies desperate for solutions</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span><strong>Telehealth integration:</strong> Expand into remote consultations and predictive analytics</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span><strong>Insurance partnerships:</strong> Subsidies for elderly care technology adoption</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-red-900 flex items-center gap-2">
                      <TrendingDown className="w-5 h-5" /> Threats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span><strong>Established EHR players:</strong> Major vendors (Epic, Cerner) adding AI features</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span><strong>Regulatory changes:</strong> Stricter data privacy laws (GDPR, state-level regulations)</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span><strong>Data privacy concerns:</strong> Families hesitant to share health data with AI systems</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Business Model Canvas */}
            <TabsContent value="bmc" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base">Value Propositions</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p><strong>For Caregivers:</strong> 80%+ reduction in paperwork, more time with patients</p>
                    <p><strong>For Families:</strong> Real-time peace of mind and health transparency</p>
                    <p><strong>For Doctors:</strong> Clinical-grade structured reports for better decision-making</p>
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base">Customer Segments</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p><strong>Primary:</strong> Home healthcare agencies, independent caregivers</p>
                    <p><strong>Payers:</strong> Family members, legal guardians</p>
                    <p><strong>Secondary:</strong> Insurance providers, medical device manufacturers</p>
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base">Revenue Streams</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p><strong>Subscription:</strong> $19/mo (families), $99/mo (small agencies)</p>
                    <p><strong>Premium tier:</strong> Advanced health analytics and predictive insights</p>
                    <p><strong>Enterprise:</strong> Agency-level licensing with custom integrations</p>
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base">Key Activities & Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p><strong>Activities:</strong> AI model training, cloud infrastructure, UI/UX design</p>
                    <p><strong>Resources:</strong> Proprietary reporting engine, healthcare domain expertise, secure data storage</p>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">Key Partnerships & Cost Structure</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p><strong>Partnerships:</strong> Home health agencies, medical device manufacturers, insurance companies</p>
                    <p><strong>Costs:</strong> AI API costs, cloud hosting, marketing, regulatory compliance audits</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* PESTEL Analysis */}
            <TabsContent value="pestel" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base">Political</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    Government focus on elderly care funding and potential subsidies for home-care technology. Favorable policy environment for healthcare innovation.
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base">Economic</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    Rising professional nursing costs drive demand for cost-effective solutions. Families seeking affordable monitoring alternatives to institutional care.
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base">Social</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    "Silver Tsunami" demographic shift; 24% of US adults are caregivers. Strong cultural preference for aging in place rather than nursing homes.
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base">Technological</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    Advancements in LLMs for medical transcription, widespread smartphone adoption among caregivers, IoT device integration capabilities.
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base">Environmental</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    Reduction in paper-based reporting lowers carbon footprint. Digital-first approach supports sustainability goals in healthcare.
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base">Legal</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    Strict HIPAA/GDPR compliance requirements. Liability issues regarding AI-generated medical advice. Ongoing regulatory evolution in healthcare AI.
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 7Ps Marketing Mix */}
            <TabsContent value="7ps" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base">Product</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    AI-powered reporting app with voice-to-text transcription, structured templates, family dashboard, and doctor-ready clinical reports. HIPAA-compliant with real-time alerts.
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base">Price</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    Tiered subscription model: $19/mo for families, $99/mo for small agencies, custom enterprise pricing. Freemium option for trial.
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base">Place</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    Digital distribution via web platform and mobile apps (iOS/Android). Direct B2B sales to home care agencies. Partnerships with insurance providers.
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base">Promotion</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    Content marketing on caregiver burnout, LinkedIn ads for agency owners, SEO for "elderly care reporting" and "caregiver tools." Case studies showing ROI.
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base">People</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    Empathetic customer support team trained in healthcare workflows. Medical advisors for product development. AI engineers for continuous model improvement.
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-base">Process</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    Seamless onboarding for caregivers with minimal training. Automated report generation and delivery. Intuitive mobile-first interface for field use.
                  </CardContent>
                </Card>

                <Card className="border-slate-200 md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">Physical Evidence</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    Professional, clean UI with healthcare aesthetics. High-quality PDF reports. Case studies demonstrating time savings and improved outcomes. User testimonials from nurses and families.
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Impact Metrics */}
        <section className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Impact & Efficiency Gains</h3>
            <p className="text-slate-600">Quantifiable benefits for caregivers and healthcare organizations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Documentation Time Reduction</CardTitle>
                <CardDescription>Minutes per patient per visit</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={documentationTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="activity" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
                      formatter={(value) => `${value} min`}
                    />
                    <Bar dataKey="time" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Card className="border-green-200 bg-green-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-green-900">Caregiver Burnout Reduction</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-green-800">
                  <p className="text-2xl font-bold mb-1">41% → 15%</p>
                  <p>Reduction in caregivers reporting low well-being through reduced administrative burden.</p>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-blue-900">Patient Care Time Increase</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-blue-800">
                  <p className="text-2xl font-bold mb-1">+1 hour/day</p>
                  <p>Additional time per caregiver for direct patient care or necessary breaks.</p>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-purple-900">Family Satisfaction</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-purple-800">
                  <p className="text-2xl font-bold mb-1">+35%</p>
                  <p>Improved transparency and peace of mind through real-time health updates.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Go-to-Market Strategy */}
        <section className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Go-to-Market Strategy</h3>
            <p className="text-slate-600">Phased approach to market entry and customer acquisition.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-blue-600"></div>
              <CardHeader>
                <Badge className="w-fit mb-2 bg-blue-100 text-blue-800">Phase 1</Badge>
                <CardTitle className="text-base">Market Validation</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p><strong>Timeline:</strong> Months 1-3</p>
                <p><strong>Focus:</strong> Pilot with 5-10 home care agencies</p>
                <p><strong>Goal:</strong> Gather feedback, refine workflows, build case studies</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-purple-600"></div>
              <CardHeader>
                <Badge className="w-fit mb-2 bg-purple-100 text-purple-800">Phase 2</Badge>
                <CardTitle className="text-base">Early Adoption</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p><strong>Timeline:</strong> Months 4-9</p>
                <p><strong>Focus:</strong> Expand to 50+ agencies, build partner network</p>
                <p><strong>Goal:</strong> Establish market presence, generate revenue</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pink-500 to-pink-600"></div>
              <CardHeader>
                <Badge className="w-fit mb-2 bg-pink-100 text-pink-800">Phase 3</Badge>
                <CardTitle className="text-base">Scale & Expansion</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p><strong>Timeline:</strong> Months 10+</p>
                <p><strong>Focus:</strong> National rollout, insurance partnerships</p>
                <p><strong>Goal:</strong> Achieve market leadership position</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Key Recommendations */}
        <section className="space-y-6 pb-12">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Strategic Recommendations</h3>
            <p className="text-slate-600">Critical actions to maximize market opportunity and competitive advantage.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-2xl">🎯</span> Differentiation
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>Focus on <strong>caregiver experience</strong> rather than just data collection. Build voice-first interface for field use. Emphasize burnout reduction as primary value prop.</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-2xl">🤝</span> Partnerships
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>Establish partnerships with <strong>home care agencies</strong> and <strong>insurance providers</strong>. Integrate with existing EHR systems for seamless adoption.</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-gradient-to-br from-amber-50 to-orange-50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-2xl">📊</span> Data Advantage
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>Leverage aggregated, anonymized data to build <strong>predictive health analytics</strong>. Create premium tier for advanced insights and early intervention alerts.</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-2xl">🛡️</span> Compliance First
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>Invest heavily in <strong>HIPAA compliance</strong> and <strong>data security</strong>. Use this as competitive advantage against less-regulated competitors.</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-gradient-to-br from-rose-50 to-red-50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-2xl">👥</span> Community Building
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>Create <strong>caregiver community forums</strong> and support networks. Position CareNarrative as advocate for caregiver well-being, not just a tool.</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-gradient-to-br from-indigo-50 to-blue-50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-2xl">🚀</span> Continuous Innovation
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>Invest in <strong>AI model improvements</strong> and <strong>new features</strong> based on user feedback. Stay ahead of EHR vendors entering the space.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-100 py-8 mt-16">
        <div className="container text-center text-sm">
          <p className="mb-2">CareNarrative AI: Market Analysis & Business Strategy</p>
          <p className="text-slate-400">Comprehensive analysis using SWOT, BMC, PESTEL, and 7Ps frameworks</p>
        </div>
      </footer>
    </div>
  );
}
