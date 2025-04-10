export const FUNC__GetData = async (
  organization_id,
  GLOBALFUNC__GetUser__NAW,
  workedhoursObject,
  setWorkedhoursObject,
  setProjectsObject,
  setTasksObject,
  setProblemsObject,
  setActivitiesObject,
  setWorkedhoursObjectHasLoaded,
  setProjectsObjectHasLoaded,
  setTasksObjectHasLoaded,
  setProblemsObjectHasLoaded,
  setActivitiesObjectHasLoaded,
  doc,
  getDoc,
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  today,
  db
) => {
    FUNC__GetAnalytics__WorkedHours(
      db,
      onSnapshot,
      doc,
      workedhoursObject,
      setWorkedhoursObject,
      setWorkedhoursObjectHasLoaded,
      organization_id
    );

    FUNC__GetAnalytics__Projects(
      db,
      onSnapshot,
      doc,
      setProjectsObject,
      setProjectsObjectHasLoaded,
      organization_id
    );

    FUNC__GetAnalytics__Tasks(
      db,
      onSnapshot,
      doc,
      setTasksObject,
      setTasksObjectHasLoaded,
      organization_id
    );

    FUNC__GetAnalytics__problems(
      db,
      onSnapshot,
      doc,
      setProblemsObject,
      setProblemsObjectHasLoaded,
      organization_id
    );

    FUNC__GetActivities(
      GLOBALFUNC__GetUser__NAW,
      db,
      query,
      collection,
      onSnapshot,
      where,
      orderBy,
      limit,
      today,
      doc,
      getDoc,
      setActivitiesObject,
      setActivitiesObjectHasLoaded,
      organization_id
    );
};

const FUNC__GetAnalytics__WorkedHours = async (
  db,
  onSnapshot,
  doc,
  workedhoursObject,
  setWorkedhoursObject,
  setWorkedhoursObjectHasLoaded,
  organization_id
) => {
  onSnapshot(
    doc(
      db,
      'organizations', 
      organization_id,
      'analytics',
      'worked_hours_2025'
    ), (doc) => {
      setWorkedhoursObject({
        ...workedhoursObject,
        analytics: doc.data()
      });
      setWorkedhoursObjectHasLoaded(true);
    console.log("Current data: ", doc.data());
  });
};

const FUNC__GetAnalytics__Projects = async (
  db,
  onSnapshot,
  doc,
  setProjectsObject,
  setProjectsObjectHasLoaded,
  organization_id
) => {
  onSnapshot(
    doc(
      db,
      'organizations', 
      organization_id,
      'analytics',
      'projects'
    ), (doc) => {
      setProjectsObject(doc.data());
      setProjectsObjectHasLoaded(true);
    console.log("Current data: ", doc.data());
  });
};

const FUNC__GetAnalytics__Tasks = async (
  db,
  onSnapshot,
  doc,
  setTasksObject,
  setTasksObjectHasLoaded,
  organization_id
) => {
  onSnapshot(
    doc(
      db, 
      'organizations', 
      organization_id,
      'analytics',
      'tasks'
    ), (doc) => {
      setTasksObject(doc.data());
      setTasksObjectHasLoaded(true);
    console.log("Current data: ", doc.data());
  });
};

const FUNC__GetAnalytics__problems = async (
  db,
  onSnapshot,
  doc,
  setProblemsObject,
  setProblemsObjectHasLoaded,
  organization_id
) => {
  onSnapshot(
    doc(
      db, 
      'organizations', 
      organization_id,
      'analytics',
      'problems'
    ), (doc) => {
      setProblemsObject(doc.data());
      setProblemsObjectHasLoaded(true);
    console.log("Current data: ", doc.data());
  });
};

const FUNC__GetActivities = async (
  GLOBALFUNC__GetUser__NAW,
  db,
  query,
  collection,
  onSnapshot,
  where,
  orderBy,
  limit,
  today,
  doc,
  getDoc,
  setActivitiesObject,
  setActivitiesObjectHasLoaded,
  organization_id
) => {
  const q = query(
    collection(
      db, 
      'organizations', 
      organization_id,
      'activities'
    ),
    where('date', '==', today),
    orderBy('date_created', 'desc'),
    limit(10)
  );
  onSnapshot(q, async (querySnapshot) => {
    let activities = [];
    if(!querySnapshot.empty){
      querySnapshot.forEach((doc) => {
          //cities.push(doc.data().name);
          activities.push({
            ...doc.data(),
            activity_id: doc.id
          });
      });
      const completedActivities = await FUNC__CompleteActivityData(
        GLOBALFUNC__GetUser__NAW,
        activities,
        organization_id,
        db,
        doc,
        getDoc
      );
      setActivitiesObject(completedActivities);
    }
    setActivitiesObjectHasLoaded(true);
  });
};
/*
*
*
* 
* 
    REF: FUNC__CompleteActivityData
    -> WHAT IS IT / WHAT DOES IT DO: 
        ---> Fetch other documents related to an activity
             before the UI is filled
*
*
* 
* 
*/
const FUNC__CompleteActivityData = async (
  GLOBALFUNC__GetUser__NAW,
  activities,
  organization_id,
  db,
  doc,
  getDoc
) => {
  let newActivities = [];
  await Promise.all(
    activities.map(activity => {
      return Promise.all([
        GLOBALFUNC__GetUser__NAW(
          activity.user_ids,
          db,
          doc,
          getDoc
        ),
        FUNC__GetProject(
          organization_id,
          activity.project_id,
          db,
          doc,
          getDoc
        ),
        FUNC__GetPhase(
          organization_id,
          activity.project_id,
          activity.phase_id,
          db,
          doc,
          getDoc
        ),
        FUNC__GetTask(
          organization_id,
          activity.project_id,
          activity.phase_id,
          activity.task_id,
          db,
          doc,
          getDoc
        )
      ]).then(data => {
        activity['users'] = data[0];
        activity['project'] = data[1].data().name;
        activity['phase'] = data[2].data().name;
        activity['task'] = data[3].data().name;
        newActivities.push(activity);
      });
    })
  );
  return newActivities;
};

export const FUNC__GetProject = async (
  organization_id,
  project_id,
  db,
  doc,
  getDoc
) => {
  const projectDoc = doc(
      db, 
      'organizations',
      organization_id,
      'projects',
      project_id
  );
  return getDoc(projectDoc);
}

export const FUNC__GetPhase = async (
  organization_id,
  project_id,
  phase_id,
  db,
  doc,
  getDoc
) => {
  const phaseDoc = doc(
      db, 
      'organizations',
      organization_id,
      'projects',
      project_id,
      'phases',
      phase_id
  );
  return getDoc(phaseDoc);
}

export const FUNC__GetTask = async (
  organization_id,
  project_id,
  phase_id,
  task_id,
  db,
  doc,
  getDoc
) => {
  const taskDoc = doc(
      db, 
      'organizations',
      organization_id,
      'projects',
      project_id,
      'phases',
      phase_id,
      'tasks',
      task_id
  );
  return getDoc(taskDoc);
}