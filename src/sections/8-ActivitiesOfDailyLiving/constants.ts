export const independenceLevels = [
  { value: "independent", label: "Independent (7) - Complete independence" },
  { value: "modified_independent", label: "Modified Independent (6) - Uses devices/adaptations" },
  { value: "supervision", label: "Supervision (5) - Supervision/setup only" },
  { value: "minimal_assistance", label: "Minimal Assistance (4) - >75% independent" },
  { value: "moderate_assistance", label: "Moderate Assistance (3) - 50-75% independent" },
  { value: "maximal_assistance", label: "Maximal Assistance (2) - 25-49% independent" },
  { value: "total_assistance", label: "Total Assistance (1) - <25% independent" },
  { value: "not_applicable", label: "Activity Not Applicable" }
] as const;

export const adlCategories = {
  bathing: {
    title: "Bathing & Hygiene",
    items: [
      { id: "shower", title: "Bathing/Showering" },
      { id: "grooming", title: "Grooming" },
      { id: "oral_care", title: "Oral Care" },
      { id: "toileting", title: "Toileting" }
    ]
  },
  dressing: {
    title: "Dressing",
    items: [
      { id: "upper_body", title: "Upper Body Dressing" },
      { id: "lower_body", title: "Lower Body Dressing" },
      { id: "footwear", title: "Footwear Management" }
    ]
  },
  feeding: {
    title: "Feeding",
    items: [
      { id: "eating", title: "Eating" },
      { id: "setup", title: "Meal Setup" },
      { id: "drinking", title: "Drinking" }
    ]
  },
  transfers: {
    title: "Functional Mobility",
    items: [
      { id: "bed_transfer", title: "Bed Transfers", subtitle: "Moving in bed, getting in/out of bed" },
      { id: "toilet_transfer", title: "Toilet Transfers" },
      { id: "shower_transfer", title: "Shower/Tub Transfers" },
      { id: "position_changes", title: "Position Changes", subtitle: "Sit to stand, chair transfers" }
    ]
  }
} as const;

export const iadlCategories = {
  household: {
    title: "Household Management",
    items: [
      { id: "cleaning", title: "House Cleaning" },
      { id: "laundry", title: "Laundry" },
      { id: "meal_prep", title: "Meal Preparation" },
      { id: "home_maintenance", title: "Home Maintenance", subtitle: "Basic repairs, yard work" }
    ]
  },
  community: {
    title: "Community Integration",
    items: [
      { id: "transportation", title: "Transportation", subtitle: "Driving, public transit use" },
      { id: "shopping", title: "Shopping" },
      { id: "money_management", title: "Financial Management" },
      { id: "communication", title: "Communication", subtitle: "Phone, mail, email" }
    ]
  }
} as const;

export const healthCategories = {
  management: {
    title: "Health Management",
    items: [
      { id: "medications", title: "Medication Management" },
      { id: "appointments", title: "Medical Appointments" },
      { id: "monitoring", title: "Health Monitoring", subtitle: "Vitals, symptoms, etc." },
      { id: "exercise", title: "Exercise/Activity" }
    ]
  },
  routine: {
    title: "Health Routine",
    items: [
      { id: "sleep", title: "Sleep Management" },
      { id: "stress", title: "Stress Management" },
      { id: "nutrition", title: "Nutrition Management" }
    ]
  }
} as const;

export const workCategories = {
  status: {
    title: "Work Status",
    items: [
      { id: "current_status", title: "Current Work Status" },
      { id: "workplace_accommodations", title: "Workplace Accommodations" },
      { id: "training_needs", title: "Training/Education Needs" },
      { id: "barriers", title: "Return to Work Barriers" }
    ]
  }
} as const;

export const leisureCategories = {
  sports: {
    title: "Physical Activities & Sports",
    items: [
      { id: "fitness", title: "Fitness Activities", subtitle: "Gym, running, swimming, etc." },
      { id: "team_sports", title: "Team Sports", subtitle: "Basketball, soccer, volleyball, etc." },
      { id: "individual_sports", title: "Individual Sports", subtitle: "Tennis, golf, cycling, etc." },
      { id: "outdoor", title: "Outdoor Activities", subtitle: "Hiking, fishing, gardening, etc." }
    ]
  },
  social: {
    title: "Social & Leisure Activities",
    items: [
      { id: "family", title: "Family Activities", subtitle: "Time spent with family members" },
      { id: "friends", title: "Social Gatherings", subtitle: "Meeting friends, parties, etc." },
      { id: "hobbies", title: "Hobbies", subtitle: "Arts, crafts, music, reading, etc." },
      { id: "entertainment", title: "Entertainment", subtitle: "Movies, concerts, theater, etc." }
    ]
  },
  travel: {
    title: "Travel & Trips",
    items: [
      { id: "day_trips", title: "Day Trips", subtitle: "Local destinations, day outings" },
      { id: "vacations", title: "Vacations", subtitle: "Overnight trips, longer vacations" },
      { id: "business", title: "Business Travel", subtitle: "Work-related travel" }
    ]
  },
  community: {
    title: "Community Engagement",
    items: [
      { id: "volunteering", title: "Volunteering", subtitle: "Community service, helping others" },
      { id: "religious", title: "Religious/Spiritual Activities", subtitle: "Attending services, group activities" },
      { id: "education", title: "Educational Activities", subtitle: "Classes, workshops, continuing education" },
      { id: "civic", title: "Civic Participation", subtitle: "Community meetings, political activities" }
    ]
  }
} as const;