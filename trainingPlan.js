const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

export const TRAINING_META = {
  title: "80/20 Training 2026",
  subtitle: "Half Marathon Training Plan (15 weeks)",
  phases: [
    {
      name: "Phase 1: Base Building",
      weeks: "Weeks 1–6",
      goal: "Establish consistency and build aerobic volume with low-intensity running."
    },
    {
      name: "Phase 2: Peak Phase",
      weeks: "Weeks 7–13",
      goal: "Race-specific fitness: longer sustained work in Zones 3 & 4."
    },
    {
      name: "Phase 3: Taper",
      weeks: "Weeks 14–15",
      goal: "Shed fatigue; volume drops sharply while intensity keeps legs sharp."
    }
  ],
  notes: [
    "Check Running_Paces.pdf regularly; retest lactate threshold every 4–6 weeks.",
    "Watch for cardiac drift on Sunday long runs; slow down to stay in Zone 2." 
  ]
};

function pad2(n){
  return String(n).padStart(2, "0");
}

export function toISODate(d){
  return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
}

export function parseISODate(value){
  // value: YYYY-MM-DD
  const [y,m,day] = (value || "").split("-").map(Number);
  if (!y || !m || !day) return null;
  const d = new Date(Date.UTC(y, m-1, day));
  // convert to local date at midnight to keep calendar stable across timezones
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

export function getMondayOfWeek(date){
  const d = new Date(date);
  d.setHours(0,0,0,0);
  const day = d.getDay(); // 0 Sun .. 6 Sat
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function addDays(base, days){
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function wk(weekNum, entries){
  // entries: array of 7 workout objects (or null)
  return { week: weekNum, days: entries };
}

function w({ title, duration, zone, kind, details }){
  return {
    title,
    duration: duration ?? "",
    zone: zone ?? "",
    kind: kind ?? "",
    details: Array.isArray(details) ? details : (details ? [details] : [])
  };
}

const PLAN = [
  // Phase 1: Base Building (weeks 1–6)
  wk(1, [
    w({ title:"Foundation Run", duration:"40 mins", zone:"Z2", kind:"z2", details:["Run 40 minutes in Zone 2 (10:30–11:30)."] }),
    w({ title:"Speed Play (Fartlek)", duration:"45 mins", zone:"Z5/Z1", kind:"z5", details:[
      "5 min Z1 (Warm-up).",
      "5 min Z2.",
      "5 × (1 min Z5 / 2 min Z1) — 1 min fast (~6:30 pace), recover 2 min very slow.",
      "5 min Z2.",
      "15 min Z1 (Cool-down)."
    ]}),
    w({ title:"Foundation Run", duration:"45 mins", zone:"Z2", kind:"z2", details:["Run 45 minutes in Zone 2 (10:30–11:30)."] }),
    w({ title:"Tempo Run", duration:"50 mins", zone:"Z3", kind:"z3", details:[
      "5 min Z1.",
      "5 min Z2.",
      "20 min Z3 (Aerobic Tempo @ 9:30–10:00) — comfortably hard.",
      "5 min Z2.",
      "15 min Z1."
    ]}),
    w({ title:"Recovery Run", duration:"30 mins", zone:"Z1", kind:"z1", details:["Run 30 minutes in Zone 1 (slower than 11:30). Very easy."] }),
    w({ title:"Foundation Run", duration:"50 mins", zone:"Z2", kind:"z2", details:["Run 50 minutes in Zone 2 (10:30–11:30)."] }),
    w({ title:"Long Run", duration:"1 hr 15 mins", zone:"Z2", kind:"z2", details:["Run 75 minutes in Zone 2 (10:30–11:30)."] })
  ]),
  wk(2, [
    w({ title:"Foundation Run", duration:"40 mins", zone:"Z2", kind:"z2", details:["Run 40 minutes in Zone 2 (10:30–11:30)."] }),
    w({ title:"Speed Play", duration:"48 mins", zone:"Z5/Z1", kind:"z5", details:[
      "5 min Z1.",
      "5 min Z2.",
      "6 × (1 min Z5 / 2 min Z1) — 1 min fast, 2 min easy.",
      "5 min Z2.",
      "15 min Z1."
    ]}),
    w({ title:"Foundation Run", duration:"50 mins", zone:"Z2", kind:"z2", details:["Run 50 minutes in Zone 2 (10:30–11:30)."] }),
    w({ title:"Tempo Run", duration:"55 mins", zone:"Z3", kind:"z3", details:[
      "5 min Z1.",
      "5 min Z2.",
      "25 min Z3 (Aerobic Tempo @ 9:30–10:00).",
      "5 min Z2.",
      "15 min Z1."
    ]}),
    w({ title:"Recovery Run", duration:"35 mins", zone:"Z1", kind:"z1", details:["Run 35 minutes in Zone 1 (slower than 11:30)."] }),
    w({ title:"Foundation Run", duration:"55 mins", zone:"Z2", kind:"z2", details:["Run 55 minutes in Zone 2 (10:30–11:30)."] }),
    w({ title:"Long Run", duration:"1 hr 25 mins", zone:"Z2", kind:"z2", details:["Run 85 minutes in Zone 2 (10:30–11:30)."] })
  ]),
  wk(3, [
    w({ title:"Foundation Run", duration:"40 mins", zone:"Z2", kind:"z2", details:["Run 40 minutes in Zone 2 (10:30–11:30)."] }),
    w({ title:"Speed Play", duration:"39 mins", zone:"Z5/Z1", kind:"z5", details:[
      "5 min Z1.",
      "5 min Z2.",
      "3 × (1 min Z5 / 2 min Z1).",
      "5 min Z2.",
      "15 min Z1."
    ]}),
    w({ title:"Recovery Run", duration:"30 mins", zone:"Z1", kind:"z1", details:["Run 30 minutes in Zone 1 (slower than 11:30)."] }),
    w({ title:"Tempo Run", duration:"45 mins", zone:"Z3", kind:"z3", details:[
      "5 min Z1.",
      "5 min Z2.",
      "15 min Z3 (Aerobic Tempo @ 9:30–10:00).",
      "5 min Z2.",
      "15 min Z1."
    ]}),
    w({ title:"Rest Day / Optional Cross Training", duration:"30 mins", zone:"Easy", kind:"cross", details:["Rest day, or optional easy swim/bike (~30 mins)."] }),
    w({ title:"Foundation Run", duration:"40 mins", zone:"Z2", kind:"z2", details:["Run 40 minutes in Zone 2 (10:30–11:30)."] }),
    w({ title:"Long Run", duration:"1 hr", zone:"Z2", kind:"z2", details:["Run 60 minutes in Zone 2 (10:30–11:30)."] })
  ]),
  wk(4, [
    w({ title:"Foundation Run", duration:"45 mins", zone:"Z2", kind:"z2", details:["Run 45 minutes in Zone 2 (10:30–11:30)."] }),
    w({ title:"Speed Play", duration:"51 mins", zone:"Z5/Z1", kind:"z5", details:[
      "5 min Z1.",
      "5 min Z2.",
      "7 × (1 min Z5 / 2 min Z1).",
      "5 min Z2.",
      "15 min Z1."
    ]}),
    w({ title:"Foundation Run", duration:"55 mins", zone:"Z2", kind:"z2", details:["Run 55 minutes in Zone 2 (10:30–11:30)."] }),
    w({ title:"Tempo Run", duration:"60 mins", zone:"Z3", kind:"z3", details:[
      "5 min Z1.",
      "5 min Z2.",
      "30 min Z3 (Aerobic Tempo @ 9:30–10:00).",
      "5 min Z2.",
      "15 min Z1."
    ]}),
    w({ title:"Recovery Run", duration:"35 mins", zone:"Z1", kind:"z1", details:["Run 35 minutes in Zone 1 (slower than 11:30)."] }),
    w({ title:"Foundation Run", duration:"1 hr", zone:"Z2", kind:"z2", details:["Run 60 minutes in Zone 2 (10:30–11:30)."] }),
    w({ title:"Long Run", duration:"1 hr 35 mins", zone:"Z2", kind:"z2", details:["Run 95 minutes in Zone 2 (10:30–11:30)."] })
  ]),
  wk(5, [
    w({ title:"Foundation Run", duration:"50 mins", zone:"Z2", kind:"z2", details:["Run 50 minutes in Zone 2."] }),
    w({ title:"Speed Play", duration:"45 mins", zone:"Z5/Z1", kind:"z5", details:[
      "5 min Z1, 5 min Z2.",
      "8 × (1 min Z5 / 2 min Z1) — short fast bursts.",
      "5 min Z1."
    ]}),
    w({ title:"Foundation Run", duration:"1 hr", zone:"Z2", kind:"z2", details:["Run 60 minutes in Zone 2."] }),
    w({ title:"Tempo Run", duration:"55 mins", zone:"Z3", kind:"z3", details:[
      "5 min Z1, 5 min Z2.",
      "35 min Z3 — sustained moderate effort.",
      "5 min Z2, 5 min Z1."
    ]}),
    w({ title:"Recovery Run", duration:"35 mins", zone:"Z1", kind:"z1", details:["Run 35 minutes in Zone 1."] }),
    w({ title:"Foundation Run", duration:"50 mins", zone:"Z2", kind:"z2", details:["Run 50 minutes in Zone 2."] }),
    w({ title:"Long Run", duration:"1 hr 40 mins", zone:"Z2", kind:"z2", details:["Run 100 minutes (~10 miles) in Zone 2."] })
  ]),
  wk(6, [
    w({ title:"Foundation Run", duration:"40 mins", zone:"Z2", kind:"z2", details:["Run 40 minutes in Zone 2."] }),
    w({ title:"Speed Play", duration:"40 mins", zone:"Z5/Z1", kind:"z5", details:[
      "Warm-up.",
      "5 × (1 min Z5 / 2 min Z1).",
      "Cool-down."
    ]}),
    w({ title:"Recovery Run", duration:"30 mins", zone:"Z1", kind:"z1", details:["Run 30 minutes in Zone 1."] }),
    w({ title:"Tempo Run", duration:"45 mins", zone:"Z3", kind:"z3", details:["Warm-up, 20 min Z3, cool-down."] }),
    w({ title:"Rest Day", duration:"—", zone:"Rest", kind:"rest", details:["Rest day."] }),
    w({ title:"Foundation Run", duration:"40 mins", zone:"Z2", kind:"z2", details:["Run 40 minutes in Zone 2."] }),
    w({ title:"Long Run", duration:"1 hr 10 mins", zone:"Z2", kind:"z2", details:["Run 70 minutes (~7 miles) in Zone 2."] })
  ]),

  // Phase 2: Peak Phase (weeks 7–13)
  wk(7, [
    w({ title:"Foundation Run", duration:"50 mins", zone:"Z2", kind:"z2", details:["Run 50 minutes in Zone 2."] }),
    w({ title:"High Intensity Intervals", duration:"50 mins", zone:"Z4/Z1", kind:"z4", details:[
      "Warm-up (10–15 min).",
      "5 × (3 min Z4 / 2 min Z1) — threshold pace (~7:30–7:50/mi).",
      "Cool-down (10 min)."
    ]}),
    w({ title:"Foundation Run", duration:"1 hr", zone:"Z2", kind:"z2", details:["Run 60 minutes in Zone 2."] }),
    w({ title:"Tempo Run", duration:"1 hr", zone:"Z3", kind:"z3", details:["Warm-up, 40 min Z3, cool-down."] }),
    w({ title:"Recovery Run", duration:"35 mins", zone:"Z1", kind:"z1", details:["Run 35 minutes in Zone 1."] }),
    w({ title:"Foundation Run", duration:"50 mins", zone:"Z2", kind:"z2", details:["Run 50 minutes in Zone 2."] }),
    w({ title:"Long Run", duration:"1 hr 45 mins", zone:"Z2", kind:"z2", details:["Run 105 minutes (~11 miles) in Zone 2."] })
  ]),
  wk(8, [
    w({ title:"Foundation Run", duration:"55 mins", zone:"Z2", kind:"z2", details:["Run 55 minutes in Zone 2."] }),
    w({ title:"High Intensity Intervals", duration:"55 mins", zone:"Z4/Z1", kind:"z4", details:[
      "Warm-up.",
      "6 × (3 min Z4 / 2 min Z1).",
      "Cool-down."
    ]}),
    w({ title:"Foundation Run", duration:"1 hr 5 mins", zone:"Z2", kind:"z2", details:["Run 65 minutes in Zone 2."] }),
    w({ title:"Cruise Intervals", duration:"1 hr 5 mins", zone:"Z3/Z1", kind:"z3", details:[
      "Warm-up.",
      "4 × (10 min Z3 / 2 min Z1) — broken tempo.",
      "Cool-down."
    ]}),
    w({ title:"Recovery Run", duration:"40 mins", zone:"Z1", kind:"z1", details:["Run 40 minutes in Zone 1."] }),
    w({ title:"Foundation Run", duration:"55 mins", zone:"Z2", kind:"z2", details:["Run 55 minutes in Zone 2."] }),
    w({ title:"Long Run", duration:"1 hr 50 mins", zone:"Z2", kind:"z2", details:["Run 110 minutes (~12 miles) in Zone 2."] })
  ]),
  wk(9, [
    w({ title:"Foundation Run", duration:"45 mins", zone:"Z2", kind:"z2", details:["Run 45 minutes in Zone 2."] }),
    w({ title:"Speed Play", duration:"45 mins", zone:"Z5/Z1", kind:"z5", details:["Lighter session (e.g., 6 × 1 min Z5)."] }),
    w({ title:"Recovery Run", duration:"35 mins", zone:"Z1", kind:"z1", details:["Run 35 minutes in Zone 1."] }),
    w({ title:"Tempo Run", duration:"50 mins", zone:"Z3", kind:"z3", details:["25 min Z3 within the run."] }),
    w({ title:"Rest Day", duration:"—", zone:"Rest", kind:"rest", details:["Rest day."] }),
    w({ title:"Foundation Run", duration:"45 mins", zone:"Z2", kind:"z2", details:["Run 45 minutes in Zone 2."] }),
    w({ title:"Long Run", duration:"1 hr 15 mins", zone:"Z2", kind:"z2", details:["Run 75 minutes (~8 miles) in Zone 2."] })
  ]),
  wk(10, [
    w({ title:"Foundation Run", duration:"55 mins", zone:"Z2", kind:"z2", details:["Run 55 minutes (mostly Zone 2)."] }),
    w({ title:"Long Intervals", duration:"1 hr", zone:"Z4/Z1", kind:"z4", details:[
      "Warm-up.",
      "5 × (4 min Z4 / 3 min Z1).",
      "Cool-down."
    ]}),
    w({ title:"Foundation Run", duration:"1 hr 10 mins", zone:"Z2", kind:"z2", details:["Run 70 minutes (mostly Zone 2)."] }),
    w({ title:"Tempo Run", duration:"1 hr 10 mins", zone:"Z3", kind:"z3", details:["45 min Z3 continuous within the run."] }),
    w({ title:"Recovery Run", duration:"40 mins", zone:"Z1", kind:"z1", details:["Run 40 minutes in Zone 1."] }),
    w({ title:"Foundation Run", duration:"1 hr", zone:"Z2", kind:"z2", details:["Run 60 minutes in Zone 2."] }),
    w({ title:"Long Run (Fast Finish)", duration:"1 hr 55 mins", zone:"Z2→Z3", kind:"z3", details:[
      "Run Zone 2 until the last 15 mins.",
      "Last 15 mins: Zone 3 steady/tempo (finish fast on tired legs)."
    ]})
  ]),
  wk(11, [
    w({ title:"Foundation Run", duration:"1 hr", zone:"Z2", kind:"z2", details:["Run 60 minutes in Zone 2."] }),
    w({ title:"Long Intervals", duration:"1 hr 10 mins", zone:"Z4/Z1", kind:"z4", details:["4 × (5 min Z4 / 3 min Z1)."] }),
    w({ title:"Foundation Run", duration:"1 hr 15 mins", zone:"Z2", kind:"z2", details:["Run 75 minutes in Zone 2."] }),
    w({ title:"Cruise Intervals", duration:"1 hr 15 mins", zone:"Z3/Z1", kind:"z3", details:["3 × (15 min Z3 / 3 min Z1)."] }),
    w({ title:"Recovery Run", duration:"40 mins", zone:"Z1", kind:"z1", details:["Run 40 minutes in Zone 1."] }),
    w({ title:"Foundation Run", duration:"1 hr", zone:"Z2", kind:"z2", details:["Run 60 minutes in Zone 2."] }),
    w({ title:"Long Run", duration:"2 hrs", zone:"Z2", kind:"z2", details:["Peak long run: 120 minutes (~13–14 miles) in Zone 2."] })
  ]),
  wk(12, [
    w({ title:"Foundation Run", duration:"45 mins", zone:"Z2", kind:"z2", details:["Reduced-volume recovery week (similar to Week 9)."] }),
    w({ title:"Speed Play", duration:"45 mins", zone:"Z5/Z1", kind:"z5", details:["Lighter speed session (e.g., 6 × 1 min Z5)."] }),
    w({ title:"Recovery Run", duration:"35 mins", zone:"Z1", kind:"z1", details:["Easy recovery run in Zone 1."] }),
    w({ title:"Tempo Run", duration:"50 mins", zone:"Z3", kind:"z3", details:["25 min Z3 within the run."] }),
    w({ title:"Rest Day", duration:"—", zone:"Rest", kind:"rest", details:["Rest day."] }),
    w({ title:"Foundation Run", duration:"45 mins", zone:"Z2", kind:"z2", details:["Easy foundation run in Zone 2."] }),
    w({ title:"Long Run", duration:"1 hr 20 mins", zone:"Z2", kind:"z2", details:["Sunday long run: 80 minutes in Zone 2."] })
  ]),
  wk(13, [
    w({ title:"Foundation Run", duration:"50 mins", zone:"Z2", kind:"z2", details:["Run 50 minutes (mostly Zone 2)."] }),
    w({ title:"Mixed Intervals", duration:"1 hr", zone:"Z5+Z4/Z1", kind:"z4", details:[
      "Warm-up.",
      "3 × (1 min Z5 / 2 min Z1) + 3 × (3 min Z4 / 2 min Z1).",
      "Cool-down."
    ]}),
    w({ title:"Foundation Run", duration:"1 hr", zone:"Z2", kind:"z2", details:["Run 60 minutes in Zone 2."] }),
    w({ title:"Tempo Run", duration:"55 mins", zone:"Z3", kind:"z3", details:["30 min Z3 within the run."] }),
    w({ title:"Recovery Run", duration:"35 mins", zone:"Z1", kind:"z1", details:["Run 35 minutes in Zone 1."] }),
    w({ title:"Foundation Run", duration:"45 mins", zone:"Z2", kind:"z2", details:["Run 45 minutes in Zone 2."] }),
    w({ title:"Long Run", duration:"1 hr 30 mins", zone:"Z2", kind:"z2", details:["Run 90 minutes in Zone 2."] })
  ]),

  // Phase 3: Taper (weeks 14–15)
  wk(14, [
    w({ title:"Recovery Run", duration:"40 mins", zone:"Z1", kind:"z1", details:["Run 40 minutes in Zone 1."] }),
    w({ title:"Speed Play", duration:"45 mins", zone:"Z5/Z1", kind:"z5", details:["5 × (1 min Z5 / 2 min Z1)."] }),
    w({ title:"Foundation Run", duration:"45 mins", zone:"Z2", kind:"z2", details:["Run 45 minutes in Zone 2."] }),
    w({ title:"Tempo Run", duration:"40 mins", zone:"Z3", kind:"z3", details:["20 min Z3 (keep it controlled)."] }),
    w({ title:"Rest Day", duration:"—", zone:"Rest", kind:"rest", details:["Rest day."] }),
    w({ title:"Recovery Run", duration:"30 mins", zone:"Z1", kind:"z1", details:["Run 30 minutes in Zone 1."] }),
    w({ title:"Long Run", duration:"1 hr", zone:"Z2", kind:"z2", details:["Very easy Zone 2 long run (~60 minutes)."] })
  ]),
  wk(15, [
    w({ title:"Recovery Run", duration:"30 mins", zone:"Z1", kind:"z1", details:["Run 30 minutes in Zone 1."] }),
    w({ title:"Interval Tune-up", duration:"35 mins", zone:"Z4/Z1", kind:"z4", details:[
      "Warm-up.",
      "3 × (2 min Z4 / 2 min Z1) — find some pop.",
      "Cool-down."
    ]}),
    w({ title:"Recovery Run", duration:"30 mins", zone:"Z1", kind:"z1", details:["Run 30 minutes in Zone 1."] }),
    w({ title:"Rest Day", duration:"—", zone:"Rest", kind:"rest", details:["Rest day."] }),
    w({ title:"Shakeout Run", duration:"20 mins", zone:"Z1", kind:"z1", details:["Very easy shakeout in Zone 1."] }),
    w({ title:"RACE DAY: HALF MARATHON", duration:"Race", zone:"Z3→Z5", kind:"race", details:[
      "Strategy:",
      "• Start in Zone 3 (steady).",
      "• Middle miles: Zone 4 (threshold).",
      "• Final 1–2 miles: Zone 5 (give everything left)."
    ]}),
    w({ title:"Rest / Recovery", duration:"—", zone:"Rest", kind:"rest", details:["Recovery day. Walk + mobility if you feel good."] })
  ])
];

function getPhaseForWeek(week){
  if (week <= 6) return { name: TRAINING_META.phases[0].name, goal: TRAINING_META.phases[0].goal };
  if (week <= 13) return { name: TRAINING_META.phases[1].name, goal: TRAINING_META.phases[1].goal };
  return { name: TRAINING_META.phases[2].name, goal: TRAINING_META.phases[2].goal };
}

export function buildTrainingEvents(week1Monday){
  const monday = getMondayOfWeek(week1Monday);

  const events = [];
  for (const weekObj of PLAN){
    const phase = getPhaseForWeek(weekObj.week);
    const weekStart = addDays(monday, (weekObj.week - 1) * 7);

    weekObj.days.forEach((workout, idx) => {
      if (!workout) return;
      const dayDate = addDays(weekStart, idx);

      const title = workout.title;

      const kind = workout.kind || "";
      const classNames = [];
      if (kind) classNames.push(kind);

      // Provide a stable zone badge class when kind is not a direct zone.
      if (["z1","z2","z3","z4","z5"].includes(kind)) {
        // already in classNames
      } else if (workout.zone.includes("Z1")) classNames.push("z1");
      else if (workout.zone.includes("Z2")) classNames.push("z2");
      else if (workout.zone.includes("Z3")) classNames.push("z3");
      else if (workout.zone.includes("Z4")) classNames.push("z4");
      else if (workout.zone.includes("Z5")) classNames.push("z5");

      events.push({
        id: `w${weekObj.week}-${idx}`,
        title,
        start: toISODate(dayDate),
        allDay: true,
        classNames,
        extendedProps: {
          week: weekObj.week,
          dayName: DAYS[idx],
          phaseName: phase.name,
          phaseGoal: phase.goal,
          workoutTitle: workout.title,
          duration: workout.duration,
          zone: workout.zone,
          kind: workout.kind,
          details: workout.details
        }
      });
    });
  }

  return events;
}
