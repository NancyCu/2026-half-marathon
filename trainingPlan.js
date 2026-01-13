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
  // Workouts (templates) — updated to match the provided 15-week plan.
  (() => {
    const T = {
      "Foundation Run 5": w({
        title: "Foundation Run 5",
        duration: "40 mins",
        zone: "Z1/Z2",
        kind: "z2",
        details: ["5 min Z1", "30 min Z2", "5 min Z1"]
      }),
      "Foundation Run 6": w({
        title: "Foundation Run 6",
        duration: "45 mins",
        zone: "Z1/Z2",
        kind: "z2",
        details: ["5 min Z1", "35 min Z2", "5 min Z1"]
      }),
      "Foundation Run 7": w({
        title: "Foundation Run 7",
        duration: "50 mins",
        zone: "Z1/Z2",
        kind: "z2",
        details: ["5 min Z1", "40 min Z2", "5 min Z1"]
      }),
      "Foundation Run 8": w({
        title: "Foundation Run 8",
        duration: "55 mins",
        zone: "Z1/Z2",
        kind: "z2",
        details: ["5 min Z1", "45 min Z2", "5 min Z1"]
      }),
      "Foundation Run 9": w({
        title: "Foundation Run 9",
        duration: "60 mins",
        zone: "Z1/Z2",
        kind: "z2",
        details: ["5 min Z1", "50 min Z2", "5 min Z1"]
      }),

      "Recovery Run 1": w({
        title: "Recovery Run 1",
        duration: "20 mins",
        zone: "Z1",
        kind: "z1",
        details: ["20 mins Z1 (Shakeout)"]
      }),
      "Recovery Run 3": w({
        title: "Recovery Run 3",
        duration: "30 mins",
        zone: "Z1",
        kind: "z1",
        details: ["30 mins Z1"]
      }),
      "Recovery Run 4": w({
        title: "Recovery Run 4",
        duration: "35 mins",
        zone: "Z1",
        kind: "z1",
        details: ["35 mins Z1"]
      }),
      "Recovery Run 5": w({
        title: "Recovery Run 5",
        duration: "40 mins",
        zone: "Z1",
        kind: "z1",
        details: ["40 mins Z1"]
      }),

      "Fast Finish Run 1": w({
        title: "Fast Finish Run 1",
        duration: "25 mins",
        zone: "Z1/Z2/Z3",
        kind: "z3",
        details: ["5 min Z1", "15 min Z2", "5 min Z3"]
      }),
      "Fast Finish Run 2": w({
        title: "Fast Finish Run 2",
        duration: "30 mins",
        zone: "Z1/Z2/Z3",
        kind: "z3",
        details: ["5 min Z1", "20 min Z2", "5 min Z3"]
      }),
      "Fast Finish Run 3": w({
        title: "Fast Finish Run 3",
        duration: "35 mins",
        zone: "Z1/Z2/Z3",
        kind: "z3",
        details: ["5 min Z1", "20 min Z2", "10 min Z3"]
      }),
      "Fast Finish Run 4": w({
        title: "Fast Finish Run 4",
        duration: "40 mins",
        zone: "Z1/Z2/Z3",
        kind: "z3",
        details: ["5 min Z1", "25 min Z2", "10 min Z3"]
      }),
      "Fast Finish Run 6": w({
        title: "Fast Finish Run 6",
        duration: "47 mins",
        zone: "Z1/Z2/Z3",
        kind: "z3",
        details: ["5 min Z1", "30 min Z2", "12 min Z3"]
      }),

      "Tempo Run 1": w({
        title: "Tempo Run 1",
        duration: "35 mins",
        zone: "Z1/Z2/Z3",
        kind: "z3",
        details: ["5 min Z1", "5 min Z2", "15 min Z3", "5 min Z2", "5 min Z1"]
      }),
      "Tempo Run 2": w({
        title: "Tempo Run 2",
        duration: "38 mins",
        zone: "Z1/Z2/Z3",
        kind: "z3",
        details: ["5 min Z1", "5 min Z2", "18 min Z3", "5 min Z2", "5 min Z1"]
      }),
      "Tempo Run 3": w({
        title: "Tempo Run 3",
        duration: "40 mins",
        zone: "Z1/Z2/Z3",
        kind: "z3",
        details: ["5 min Z1", "5 min Z2", "20 min Z3", "5 min Z2", "5 min Z1"]
      }),
      "Tempo Run 4": w({
        title: "Tempo Run 4",
        duration: "44 mins",
        zone: "Z1/Z2/Z3",
        kind: "z3",
        details: ["5 min Z1", "5 min Z2", "24 min Z3", "5 min Z2", "5 min Z1"]
      }),
      "Tempo Run 6": w({
        title: "Tempo Run 6",
        duration: "50 mins",
        zone: "Z1/Z2/Z3",
        kind: "z3",
        details: ["5 min Z1", "5 min Z2", "30 min Z3", "5 min Z2", "5 min Z1"]
      }),
      "Tempo Run 7": w({
        title: "Tempo Run 7",
        duration: "52 mins",
        zone: "Z1/Z2/Z3",
        kind: "z3",
        details: ["5 min Z1", "5 min Z2", "32 min Z3", "5 min Z2", "5 min Z1"]
      }),
      "Tempo Run 9": w({
        title: "Tempo Run 9",
        duration: "60 mins",
        zone: "Z1/Z2/Z3",
        kind: "z3",
        details: ["5 min Z1", "5 min Z2", "40 min Z3", "5 min Z2", "5 min Z1"]
      }),

      "Speed Play Run 1": w({
        title: "Speed Play Run 1",
        duration: "27 mins",
        zone: "Z4/Z1",
        kind: "z4",
        details: ["Main set: 3 x (2 min Z4 / 2 min Z1)"]
      }),
      "Speed Play Run 2": w({
        title: "Speed Play Run 2",
        duration: "30 mins",
        zone: "Z5/Z1",
        kind: "z5",
        details: ["Main set: 5 x (1 min Z5 / 2 min Z1)"]
      }),
      "Speed Play Run 3": w({
        title: "Speed Play Run 3",
        duration: "31 mins",
        zone: "Z1/Z2/Z4",
        kind: "z4",
        details: ["5 min Z1", "5 min Z2", "4 x (2 min Z4 / 2 min Z1)", "5 min Z1"]
      }),
      "Speed Play Run 4": w({
        title: "Speed Play Run 4",
        duration: "33 mins",
        zone: "Z1/Z2/Z5",
        kind: "z5",
        details: ["5 min Z1", "5 min Z2", "6 x (1 min Z5 / 2 min Z1)", "5 min Z1"]
      }),

      "Hill Repetition Run 4": w({
        title: "Hill Repetition Run 4",
        duration: "35 mins",
        zone: "Z1/Z2/Z5",
        kind: "z5",
        details: ["5 min Z1", "5 min Z2", "10 x (30 sec Z5 Uphill / 90 sec Z1)", "5 min Z1"]
      }),

      "Short Interval Run 2": w({
        title: "Short Interval Run 2",
        duration: "39 mins",
        zone: "Z1/Z2/Z5",
        kind: "z5",
        details: ["5 min Z1", "5 min Z2", "8 x (1 min Z5 / 2 min Z1)", "5 min Z1"]
      }),
      "Long Interval Run 2": w({
        title: "Long Interval Run 2",
        duration: "35 mins",
        zone: "Z1/Z2/Z4",
        kind: "z4",
        details: ["5 min Z1", "5 min Z2", "4 x (3 min Z4 / 2 min Z1)", "5 min Z1"]
      }),
      "Mixed Interval Run 1": w({
        title: "Mixed Interval Run 1",
        duration: "36 mins",
        zone: "Z1/Z2/Z3/Z4/Z5",
        kind: "z4",
        details: [
          "5 min Z1",
          "5 min Z2",
          "1 min Z5",
          "2 min Z1",
          "3 min Z4",
          "2 min Z1",
          "5 min Z3",
          "2 min Z1",
          "3 min Z4",
          "2 min Z1",
          "1 min Z5",
          "5 min Z1"
        ]
      }),

      "Cruise Interval Run 1": w({
        title: "Cruise Interval Run 1",
        duration: "52 mins",
        zone: "Z1/Z2/Z3",
        kind: "z3",
        details: ["5 min Z1", "5 min Z2", "4 x (5 min Z3 / 3 min Z1)", "5 min Z2", "5 min Z1"]
      }),
      "Cruise Interval Run 2": w({
        title: "Cruise Interval Run 2",
        duration: "64 mins",
        zone: "Z1/Z2/Z3",
        kind: "z3",
        details: ["5 min Z1", "5 min Z2", "4 x (8 min Z3 / 3 min Z1)", "5 min Z2", "5 min Z1"]
      }),
      "Cruise Interval Run 4": w({
        title: "Cruise Interval Run 4",
        duration: "80 mins",
        zone: "Z1/Z2/Z3",
        kind: "z3",
        details: ["5 min Z1", "5 min Z2", "4 x (12 min Z3 / 3 min Z1)", "5 min Z2", "5 min Z1"]
      }),

      "Long Run 1": w({
        title: "Long Run 1",
        duration: "6 miles",
        zone: "Z1/Z2",
        kind: "z2",
        details: ["1 mi Z1", "4.5 mi Z2", "0.5 mi Z1"]
      }),
      "Long Run 2": w({
        title: "Long Run 2",
        duration: "7 miles",
        zone: "Z1/Z2",
        kind: "z2",
        details: ["1 mi Z1", "5.5 mi Z2", "0.5 mi Z1"]
      }),
      "Long Run 3": w({
        title: "Long Run 3",
        duration: "8 miles",
        zone: "Z1/Z2",
        kind: "z2",
        details: ["1 mi Z1", "6.5 mi Z2", "0.5 mi Z1"]
      }),
      "Long Run 4": w({
        title: "Long Run 4",
        duration: "9 miles",
        zone: "Z1/Z2",
        kind: "z2",
        details: ["1 mi Z1", "7.5 mi Z2", "0.5 mi Z1"]
      }),
      "Long Run 5": w({
        title: "Long Run 5",
        duration: "10 miles",
        zone: "Z1/Z2",
        kind: "z2",
        details: ["1 mi Z1", "8.5 mi Z2", "0.5 mi Z1"]
      }),
      "Long Run 6": w({
        title: "Long Run 6",
        duration: "11 miles",
        zone: "Z2",
        kind: "z2",
        details: ["11 miles"]
      }),
      "Long Run 7": w({
        title: "Long Run 7",
        duration: "12 miles",
        zone: "Z2",
        kind: "z2",
        details: ["12 miles"]
      }),
      "Long Run 8": w({
        title: "Long Run 8",
        duration: "13 miles",
        zone: "Z2",
        kind: "z2",
        details: ["13 miles"]
      }),
      "Long Run 9": w({
        title: "Long Run 9",
        duration: "14 miles",
        zone: "Z2",
        kind: "z2",
        details: ["14 miles"]
      }),
      "Long Run with Fast Finish 1": w({
        title: "Long Run with Fast Finish 1",
        duration: "10 miles",
        zone: "Z1/Z2/Z3",
        kind: "z3",
        details: ["0.5 mi Z1", "8.5 mi Z2", "1 mi Z3"]
      }),

      Rest: w({ title: "Rest Day", duration: "—", zone: "Rest", kind: "rest", details: ["Rest Day"] }),
      Race: w({
        title: "RACE DAY: HALF MARATHON",
        duration: "Race",
        zone: "Z3/Z4",
        kind: "race",
        details: ["Warm-up 10 mins", "Goal Pace: Zone 3/4"]
      })
    };

    const pick = (key) => {
      const base = T[key];
      if (!base) throw new Error(`Unknown workout template: ${key}`);
      return w({ ...base });
    };

    return [
      // Phase 1: Base Building (Weeks 1–6)
      wk(1, [
        pick("Foundation Run 5"),
        pick("Fast Finish Run 2"),
        pick("Foundation Run 6"),
        pick("Tempo Run 1"),
        pick("Recovery Run 3"),
        pick("Foundation Run 5"),
        pick("Long Run 2")
      ]),
      wk(2, [
        pick("Foundation Run 5"),
        pick("Fast Finish Run 3"),
        pick("Foundation Run 7"),
        pick("Tempo Run 3"),
        pick("Recovery Run 3"),
        pick("Foundation Run 6"),
        pick("Long Run 3")
      ]),
      wk(3, [
        pick("Foundation Run 5"),
        pick("Fast Finish Run 1"),
        pick("Recovery Run 3"),
        w({
          title: "Tempo Run 1",
          duration: "35 mins",
          zone: "Z1/Z2/Z3",
          kind: "z3",
          details: ["Main set: 15 min Z3", ...T["Tempo Run 1"].details]
        }),
        pick("Rest"),
        pick("Foundation Run 5"),
        pick("Long Run 1")
      ]),
      wk(4, [
        pick("Foundation Run 6"),
        pick("Fast Finish Run 4"),
        pick("Foundation Run 8"),
        pick("Tempo Run 4"),
        pick("Recovery Run 4"),
        pick("Foundation Run 7"),
        pick("Long Run 4")
      ]),
      wk(5, [
        pick("Foundation Run 7"),
        pick("Fast Finish Run 6"),
        pick("Foundation Run 9"),
        pick("Tempo Run 6"),
        pick("Recovery Run 4"),
        pick("Foundation Run 7"),
        pick("Long Run 5")
      ]),
      wk(6, [
        pick("Foundation Run 5"),
        pick("Fast Finish Run 2"),
        pick("Recovery Run 3"),
        w({
          title: "Tempo Run 2",
          duration: "38 mins",
          zone: "Z1/Z2/Z3",
          kind: "z3",
          details: ["Main set: 18 min Z3", ...T["Tempo Run 2"].details]
        }),
        pick("Rest"),
        pick("Foundation Run 5"),
        pick("Long Run 2")
      ]),

      // Phase 2: Peak Phase (Weeks 7–13)
      wk(7, [
        pick("Foundation Run 7"),
        pick("Speed Play Run 4"),
        pick("Foundation Run 9"),
        pick("Cruise Interval Run 1"),
        pick("Recovery Run 4"),
        pick("Foundation Run 7"),
        pick("Long Run 6")
      ]),
      wk(8, [
        pick("Foundation Run 8"),
        pick("Hill Repetition Run 4"),
        pick("Foundation Run 9"),
        pick("Cruise Interval Run 2"),
        pick("Recovery Run 5"),
        pick("Foundation Run 8"),
        pick("Long Run 7")
      ]),
      wk(9, [
        pick("Foundation Run 6"),
        pick("Speed Play Run 1"),
        pick("Recovery Run 4"),
        w({
          title: "Tempo Run 3",
          duration: "40 mins",
          zone: "Z1/Z2/Z3",
          kind: "z3",
          details: ["Main set: 20 min Z3", ...T["Tempo Run 3"].details]
        }),
        pick("Rest"),
        pick("Foundation Run 6"),
        pick("Long Run 3")
      ]),
      wk(10, [
        pick("Foundation Run 8"),
        pick("Short Interval Run 2"),
        pick("Foundation Run 9"),
        pick("Tempo Run 9"),
        pick("Recovery Run 5"),
        pick("Foundation Run 9"),
        pick("Long Run with Fast Finish 1")
      ]),
      wk(11, [
        pick("Foundation Run 9"),
        pick("Long Interval Run 2"),
        pick("Foundation Run 9"),
        pick("Cruise Interval Run 4"),
        pick("Recovery Run 5"),
        pick("Foundation Run 9"),
        pick("Long Run 9")
      ]),
      wk(12, [
        pick("Foundation Run 6"),
        pick("Speed Play Run 2"),
        pick("Recovery Run 4"),
        w({
          title: "Tempo Run 4",
          duration: "44 mins",
          zone: "Z1/Z2/Z3",
          kind: "z3",
          details: ["Main set: 24 min Z3", ...T["Tempo Run 4"].details]
        }),
        pick("Rest"),
        pick("Foundation Run 6"),
        pick("Long Run 4")
      ]),
      wk(13, [
        pick("Foundation Run 7"),
        pick("Mixed Interval Run 1"),
        pick("Foundation Run 9"),
        pick("Tempo Run 7"),
        pick("Recovery Run 4"),
        pick("Foundation Run 6"),
        pick("Long Run 8")
      ]),

      // Phase 3: Taper (Weeks 14–15)
      wk(14, [
        pick("Foundation Run 5"),
        pick("Speed Play Run 3"),
        pick("Foundation Run 6"),
        w({
          title: "Tempo Run 2",
          duration: "38 mins",
          zone: "Z1/Z2/Z3",
          kind: "z3",
          details: ["Main set: 18 min Z3", ...T["Tempo Run 2"].details]
        }),
        pick("Rest"),
        pick("Recovery Run 3"),
        pick("Long Run 1")
      ]),
      wk(15, [
        pick("Recovery Run 3"),
        pick("Speed Play Run 1"),
        pick("Recovery Run 3"),
        pick("Rest"),
        pick("Recovery Run 1"),
        pick("Race"),
        null
      ])
    ];
  })()
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
