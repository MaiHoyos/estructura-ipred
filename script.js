(() => {
  "use strict";

  const STORAGE_KEY = "uis-ipred-interactivo-v2";
  const LEGACY_STORAGE_KEY = "uis-ipred-interactivo-legacy-none";
  const SCHEMA_VERSION = 2;
  const CANVAS_WIDTH = 2500;
  const MIN_ZOOM = 0.35;
  const MAX_ZOOM = 1.50;
  const ZOOM_STEP = 0.10;
  const GRID = 5;
  const FACULTY_SHIFT = 0;

  const GROUPS = ["actual", "propuesta"];
  const GROUP_BY_CORE = {
    sedes: "actual",
    escuelas: "propuesta"
  };

  const branchClass = {
    actual: "branch-rectoria",
    propuesta: "branch-purple",
    core: ""
  };

  const connectionBranchClass = {
    actual: "branch-rectoria",
    propuesta: "branch-purple"
  };

  const VIEW_META = {
    actual: {
      title: "ESTRUCTURA IPRED",
      subtitle: "Organización actual del IPRED"
    },
    propuesta: {
      title: "ESTRUCTURA IPRED — PROPUESTA",
      subtitle: "Modelo de escuelas propuesto para Consejo Superior"
    }
  };

  let currentPreset = "actual";
  let baseNodes = buildNodesForPreset(currentPreset);

  function addNode(list, id, label, x, y, w, h, parent = null, opts = {}) {
    list.push({
      id, label, x, y, w, h, parent,
      group: opts.group || "core",
      kind: opts.kind || "normal",
      relation: opts.relation || "hierarchical",
      style: opts.style || "normal",
      sourceSide: opts.sourceSide || "bottom",
      targetSide: opts.targetSide || "top",
      css: opts.css || "",
      custom: false
    });
  }

  function buildNodesForPreset(preset){
    const nodes = [];
    const add = (...args) => addNode(nodes, ...args);

    if(preset === "actual"){
      add("ipred", "IPRED", 1070, 58, 360, 58, null, {kind:"main", css:"dark"});
      add("sedes", "ORGANIZACIÓN ACTUAL\n5 SEDES", 1005, 155, 490, 72, "ipred", {kind:"main", css:"rectoria"});

      add("barbosa", "Sede Barbosa", 40, 300, 340, 54, "sedes", {group:"actual", style:"new"});
      add("barbosa-alimentos", "Ingeniería en Alimentos", 55, 385, 310, 44, "barbosa", {group:"actual", style:"sublevel"});

      add("socorro", "Sede Socorro", 430, 300, 370, 54, "sedes", {group:"actual", style:"new"});
      add("socorro-aeth", "Administración de Empresas\nTurísticas y Hoteleras", 445, 385, 340, 52, "socorro", {group:"actual", style:"sublevel"});
      add("socorro-construccion", "Ingeniería de la Construcción", 445, 447, 340, 44, "socorro", {group:"actual", style:"sublevel"});
      add("socorro-arquitectura", "Arquitectura", 445, 501, 340, 40, "socorro", {group:"actual", style:"sublevel"});

      add("malaga", "Sede Málaga", 850, 300, 340, 54, "sedes", {group:"actual", style:"new"});
      add("malaga-forestal", "Ingeniería Forestal", 865, 385, 310, 44, "malaga", {group:"actual", style:"sublevel"});
      add("malaga-zootecnia", "Zootecnia", 865, 439, 310, 40, "malaga", {group:"actual", style:"sublevel"});
      add("malaga-veterinaria", "Medicina Veterinaria", 865, 489, 310, 44, "malaga", {group:"actual", style:"sublevel"});

      add("barranca", "Sede Barranca", 1240, 300, 340, 54, "sedes", {group:"actual", style:"new"});

      add("distancia", "Distancia", 1630, 300, 420, 54, "sedes", {group:"actual", style:"new"});
      add("dist-artes", "Artes Plásticas", 1650, 385, 380, 40, "distancia", {group:"actual", style:"sublevel"});
      add("dist-agro", "Administración Agropecuaria\n(Tecnología y Técnica)", 1650, 435, 380, 52, "distancia", {group:"actual", style:"sublevel"});
      add("dist-judicial", "Tecnología en Gestión Judicial\ne Investigación Criminal", 1650, 497, 380, 52, "distancia", {group:"actual", style:"sublevel"});
      add("dist-gestion", "Gestión Empresarial", 1650, 559, 380, 40, "distancia", {group:"actual", style:"sublevel"});
      add("dist-tecnologia", "Tecnología Empresarial", 1650, 609, 380, 40, "distancia", {group:"actual", style:"sublevel"});
      return nodes;
    }

    if(preset === "propuesta"){
      add("ipred-propuesta", "IPRED", 1070, 50, 360, 58, null, {kind:"main", css:"dark"});
      add("escuelas", "PROPUESTA\nMODELO DE ESCUELAS", 980, 140, 540, 72, "ipred-propuesta", {kind:"main", css:"purple"});

      const y = 290;
      add("escuela-socorro", "Escuela Socorro", 20, y, 280, 52, "escuelas", {group:"propuesta", style:"new"});
      add("esoc-aeth", "Administración de Empresas\nTurísticas y Hoteleras", 30, 370, 260, 52, "escuela-socorro", {group:"propuesta", style:"sublevel"});
      add("esoc-construccion", "Ingeniería de la Construcción", 30, 432, 260, 44, "escuela-socorro", {group:"propuesta", style:"sublevel"});
      add("esoc-arquitectura", "Arquitectura", 30, 486, 260, 40, "escuela-socorro", {group:"propuesta", style:"sublevel"});

      add("escuela-malaga", "Escuela Málaga", 330, y, 280, 52, "escuelas", {group:"propuesta", style:"new"});
      add("emal-forestal", "Ingeniería Forestal", 340, 370, 260, 44, "escuela-malaga", {group:"propuesta", style:"sublevel"});
      add("emal-zootecnia", "Zootecnia", 340, 424, 260, 40, "escuela-malaga", {group:"propuesta", style:"sublevel"});
      add("emal-veterinaria", "Medicina Veterinaria", 340, 474, 260, 44, "escuela-malaga", {group:"propuesta", style:"sublevel"});
      add("emal-agronomica", "Ingeniería Agronómica", 340, 528, 260, 44, "escuela-malaga", {group:"propuesta", style:"sublevel"});
      add("emal-agro", "Administración Agroindustrial\n(ciclos propedéuticos)", 340, 582, 260, 52, "escuela-malaga", {group:"propuesta", style:"sublevel"});
      add("emal-agro-tec", "Técnico profesional en\nProducción Agropecuaria", 350, 646, 240, 50, "emal-agro", {group:"propuesta", style:"sublevel"});
      add("emal-agro-tecnologia", "Tecnología Agroindustrial", 350, 706, 240, 44, "emal-agro", {group:"propuesta", style:"sublevel"});
      add("emal-agro-prof", "Profesional en\nAdministración Agroindustrial", 350, 760, 240, 50, "emal-agro", {group:"propuesta", style:"sublevel"});

      add("escuela-barbosa", "Escuela Barbosa", 640, y, 280, 52, "escuelas", {group:"propuesta", style:"new"});
      add("ebar-alimentos", "Ingeniería en Alimentos", 650, 370, 260, 44, "escuela-barbosa", {group:"propuesta", style:"sublevel"});

      add("escuela-admin", "Escuela de Administración\ny Finanzas", 950, y, 290, 56, "escuelas", {group:"propuesta", style:"new"});
      add("eadm-creativas", "Administración de Empresas\nCreativas y Culturales", 965, 374, 260, 52, "escuela-admin", {group:"propuesta", style:"sublevel"});
      add("eadm-gestion", "Gestión Empresarial", 965, 436, 260, 40, "escuela-admin", {group:"propuesta", style:"sublevel"});
      add("eadm-tecnologia", "Tecnología Empresarial", 965, 486, 260, 40, "escuela-admin", {group:"propuesta", style:"sublevel"});

      add("escuela-medicina", "Escuela de Medicina", 1270, y, 280, 52, "escuelas", {group:"propuesta", style:"new"});
      add("emed-basicas", "Departamento de\nCiencias Básicas", 1280, 370, 260, 52, "escuela-medicina", {group:"propuesta", style:"sublevel"});
      add("emed-regencia", "Tecnología en Regencia\nde Farmacia", 1280, 432, 260, 52, "emed-basicas", {group:"propuesta", style:"sublevel"});

      add("escuela-artes", "Escuela de Artes", 1580, y, 280, 52, "escuelas", {group:"propuesta", style:"new"});
      add("eart-musica", "Licenciatura en Música", 1590, 370, 260, 40, "escuela-artes", {group:"propuesta", style:"sublevel"});
      add("eart-plasticas", "Artes Plásticas", 1590, 420, 260, 40, "escuela-artes", {group:"propuesta", style:"sublevel"});

      add("escuela-derecho", "Escuela de Derecho", 1890, y, 280, 52, "escuelas", {group:"propuesta", style:"new"});
      add("eder-judicial", "Tecnología en Gestión Judicial\ne Investigación Criminal", 1900, 370, 260, 52, "escuela-derecho", {group:"propuesta", style:"sublevel"});

      add("modelo-escuela-frame", "Modelo interno de Escuela", 1920, 35, 395, 205, null, {kind:"model-frame"});
      add("modelo-direccion", "Dirección de\nEscuela", 1960, 106, 140, 50, null, {kind:"model-item", style:"sublevel"});
      add("modelo-consejo", "Consejo de\nEscuela", 2130, 106, 140, 50, null, {kind:"model-item", style:"sublevel"});
      add("modelo-personal", "Personal docente\ny administrativo", 2000, 164, 190, 56, null, {kind:"model-item", style:"sublevel"});
      return nodes;
    }

    return nodes;
  }

  function buildExpandedState(preset){
    const expanded = Object.fromEntries(GROUPS.map(g => [g, false]));
    expanded[preset] = true;
    return expanded;
  }

  function buildBaseState(preset){
    return {
      schemaVersion: SCHEMA_VERSION,
      preset,
      nodes: buildNodesForPreset(preset),
      expanded: buildExpandedState(preset),
      collapsedNodes: {},
      zoom: 1
    };
  }

  let baseState = buildBaseState(currentPreset);
  const $ = s => document.querySelector(s);
  const canvas = $("#orgCanvas");
  const nodesLayer = $("#nodesLayer");
  const svg = $("#connections");
  const shell = $("#canvasShell");
  const stage = $("#canvasStage");

  const zoomOutBtn = $("#zoomOutBtn");
  const zoomInBtn = $("#zoomInBtn");
  const fitBtn = $("#fitBtn");
  const zoomValue = $("#zoomValue");
  const exportBtn = $("#exportBtn");
  const actualViewBtn = $("#actualViewBtn");
  const proposalViewBtn = $("#proposalViewBtn");
  const pageTitleEl = $("#pageTitle");
  const pageSubtitleEl = $("#pageSubtitle");

  const editBar = $("#editBar");
  const addBtn = $("#addBtn");
  const renameBtn = $("#renameBtn");
  const parentBtn = $("#parentBtn");
  const linkBtn = $("#linkBtn");
  const deleteBtn = $("#deleteBtn");
  const expandBtn = $("#expandBtn");
  const collapseBtn = $("#collapseBtn");
  const resetBtn = $("#resetBtn");

  const dialog = $("#nodeDialog");
  const dialogTitle = $("#dialogTitle");
  const labelWrap = $("#labelWrap");
  const labelInput = $("#labelInput");
  const parentWrap = $("#parentWrap");
  const parentLabel = $("#parentLabel");
  const parentSelect = $("#parentSelect");
  const relationWrap = $("#relationWrap");
  const relationSelect = $("#relationSelect");
  const styleWrap = $("#styleWrap");
  const styleSelect = $("#styleSelect");
  const anchorWrap = $("#anchorWrap");
  const sourceSideSelect = $("#sourceSideSelect");
  const targetSideSelect = $("#targetSideSelect");
  const newNodeHint = $("#newNodeHint");
  const saveDialogBtn = $("#saveDialogBtn");

  let viewStates = {};
  let state = loadState();
  currentPreset = state.preset || currentPreset;
  baseNodes = buildNodesForPreset(currentPreset);
  baseState = buildBaseState(currentPreset);
  if(!Array.isArray(state.nodes) || !state.nodes.length) state = buildBaseState(currentPreset);
  const editMode = true;
  let selectedId = null;
  let selectedLinkChildId = null;
  let dialogMode = "add";
  let drag = null;

  const PROTECTED_NODES = new Set([
    "ipred","sedes","ipred-propuesta","escuelas","ipred-orig","ipred-original-modelo"
  ]);

  function deepClone(obj){ return JSON.parse(JSON.stringify(obj)); }

  function normalizeState(parsed){
    parsed.nodes ||= [];
    parsed.nodes.forEach(n => {
      if(!n.relation) n.relation = "hierarchical";
      if(!n.style) n.style = "normal";
      if(!n.sourceSide) n.sourceSide = "auto";
      if(!n.targetSide) n.targetSide = "auto";
      if(typeof n.custom !== "boolean") n.custom = false;
    });
    parsed.collapsedNodes ||= {};
    parsed.expanded ||= {};
    GROUPS.forEach(g => {
      if(typeof parsed.expanded[g] !== "boolean") parsed.expanded[g] = false;
    });
    if(typeof parsed.zoom !== "number") parsed.zoom = 1;
    parsed.zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, parsed.zoom));
    parsed.schemaVersion ||= 1;
    if(!parsed.preset) parsed.preset = currentPreset;
    return parsed;
  }

  function loadState(){
    try{
      const raw=localStorage.getItem(STORAGE_KEY);
      if(raw){
        const parsed=JSON.parse(raw);
        if(parsed && typeof parsed.views === "object" && parsed.views !== null){
          for(const view of GROUPS){
            const candidate=parsed.views[view];
            if(candidate && Array.isArray(candidate.nodes) && candidate.nodes.length){
              viewStates[view]=normalizeState(candidate);
            }
          }
          currentPreset=VIEW_META[parsed.activeView] ? parsed.activeView : "actual";
          return deepClone(viewStates[currentPreset] || buildBaseState(currentPreset));
        }
      }
    }catch(error){
      console.warn("No se pudo recuperar la edición guardada del IPRED", error);
    }
    currentPreset="actual";
    return deepClone(buildBaseState(currentPreset));
  }

  function saveState(){
    state.preset=currentPreset;
    state.schemaVersion=SCHEMA_VERSION;
    viewStates[currentPreset]=deepClone(state);
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        schemaVersion:SCHEMA_VERSION,
        activeView:currentPreset,
        views:viewStates
      }));
    }catch(error){
      console.warn("El navegador no pudo guardar los cambios",error);
    }
  }

  function byId(id){ return state.nodes.find(n => n.id === id); }
  function childrenOf(id){ return state.nodes.filter(n => n.parent === id); }

  // Devuelve TODOS los descendientes de una casilla, no solo los hijos directos.
  // Ej.: Facultad de Salud -> Escuela de Medicina -> Departamentos.
  function descendantsOf(id){
    const result = [];
    const visited = new Set([id]);
    const queue = [id];

    while(queue.length){
      const parentId = queue.shift();
      childrenOf(parentId).forEach(child => {
        if(visited.has(child.id)) return;
        visited.add(child.id);
        result.push(child);
        queue.push(child.id);
      });
    }

    return result;
  }

  // Mueve una casilla y toda su rama exactamente el mismo delta.
  // También actualiza descendientes ocultos/contraídos porque trabaja sobre state.nodes.
  function moveBranch(rootId, dx, dy){
    const root = byId(rootId);
    if(!root) return;

    const branch = [root, ...descendantsOf(rootId)];

    // No permitir que ningún elemento de la rama salga por arriba/izquierda.
    const minX = Math.min(...branch.map(n => n.x));
    const minY = Math.min(...branch.map(n => n.y));
    const safeDx = Math.max(dx, 5 - minX);
    const safeDy = Math.max(dy, 5 - minY);

    branch.forEach(n => {
      n.x += safeDx;
      n.y += safeDy;
    });
  }

  function isNodeCollapsedByParent(node){
    let p = node.parent;
    while(p){
      if(state.collapsedNodes[p]) return true;
      p = byId(p)?.parent || null;
    }
    return false;
  }

  function isVisible(node){
    if(node.group !== "core" && !state.expanded[node.group]) return false;
    if(isNodeCollapsedByParent(node)) return false;
    return true;
  }

  function hasExpandableContent(node){
    if(GROUP_BY_CORE[node.id]) return true;
    return childrenOf(node.id).length > 0;
  }

  function isExpandedForNode(node){
    const g = GROUP_BY_CORE[node.id];
    if(g) return !!state.expanded[g];
    return !state.collapsedNodes[node.id];
  }

  function nodeBranch(node){
    if(node.group && node.group !== "core") return node.group;
    if(node.id === "vdesarrollo") return "desarrollo-social";
    if(node.id === "vbienestar") return "cultura-bienestar";
    if(node.id === "vie") return "investigacion";
    if(node.id === "vacad") return "vacademica";
    if(node.id === "vadmin") return "administrativa";
    if(node.id === "facultades") return "facultades";
    if(node.id === "rectoria") return "rectoria";
    return "core";
  }

  function updateViewButtons(){
    actualViewBtn?.classList.toggle("active-view", currentPreset === "actual");
    proposalViewBtn?.classList.toggle("active-view", currentPreset === "propuesta");
    if(actualViewBtn) actualViewBtn.hidden = currentPreset !== "propuesta";
    if(proposalViewBtn) proposalViewBtn.hidden = currentPreset === "propuesta";
  }

  function updateViewHeader(){
    const meta = VIEW_META[currentPreset] || VIEW_META.actual;
    if(pageTitleEl) pageTitleEl.textContent = meta.title;
    if(pageSubtitleEl) pageSubtitleEl.textContent = meta.subtitle;
  }

  function switchPreset(preset){
    if(!VIEW_META[preset] || preset===currentPreset) return;
    saveState();
    const keepZoom=state.zoom || 1;
    currentPreset=preset;
    baseNodes=buildNodesForPreset(currentPreset);
    baseState=buildBaseState(currentPreset);
    state=viewStates[currentPreset] ? normalizeState(deepClone(viewStates[currentPreset])) : deepClone(baseState);
    if(!viewStates[currentPreset]) state.zoom=keepZoom;
    selectedId=null;
    selectedLinkChildId=null;
    updateViewButtons();
    updateViewHeader();
    saveState();
    render();
    shell.scrollLeft=0;
    shell.scrollTop=0;
  }

  function render(){
    nodesLayer.innerHTML = "";
    canvas.classList.add("editing");

    state.nodes.forEach(node => {
      if(!isVisible(node)) return;

      if(node.kind === "model-frame"){
        const frame = document.createElement("div");
        frame.className = "model-frame";
        frame.style.left = node.x + "px";
        frame.style.top = node.y + "px";
        frame.style.width = node.w + "px";
        frame.style.height = node.h + "px";
        frame.textContent = node.label;
        nodesLayer.appendChild(frame);
        return;
      }

      const el = document.createElement("button");
      el.type = "button";
      el.className = "org-node";
      el.dataset.id = node.id;
      el.style.left = node.x + "px";
      el.style.top = node.y + "px";
      el.style.width = node.w + "px";
      el.style.height = node.h + "px";

      const branch = nodeBranch(node);
      if(branchClass[branch]) el.classList.add(branchClass[branch]);
      if(node.kind === "main") el.classList.add("main", node.css || "dark");
      if(node.kind === "faculty-header") el.classList.add("faculty-header");
      if(node.kind === "model-item") el.classList.add("model-item");
      if(node.style === "sublevel") el.classList.add("sublevel");
      if(node.style === "new") el.classList.add("new-node");
      if(node.relation === "advisory") el.classList.add("advisory");
      if(selectedId === node.id) el.classList.add("selected");
      el.classList.add("editable");

      const span = document.createElement("span");
      span.className = "label";
      node.label.split("\n").forEach((part,i) => {
        if(i) span.appendChild(document.createElement("br"));
        span.appendChild(document.createTextNode(part));
      });
      el.appendChild(span);

      if(hasExpandableContent(node)){
        const badge = document.createElement("span");
        badge.className = "toggle-badge";
        badge.textContent = isExpandedForNode(node) ? "−" : "+";
        badge.title = isExpandedForNode(node) ? "Contraer" : "Desplegar";

        // El +/− controla el despliegue incluso mientras la edición está activa.
        badge.addEventListener("pointerdown", ev => {
          ev.stopPropagation();
        });

        badge.addEventListener("click", ev => {
          ev.preventDefault();
          ev.stopPropagation();
          toggleNodeExpansion(node);
        });

        el.appendChild(badge);
      }

      el.addEventListener("click", ev => onNodeClick(ev,node));
      el.addEventListener("dblclick", ev => {
        ev.preventDefault();
        selectNode(node.id);
        openRename();
      });

      el.addEventListener("pointerdown", ev => startDrag(ev,node,el));

      nodesLayer.appendChild(el);
    });

    resizeCanvas();
    requestAnimationFrame(drawConnections);
    updateEditButtons();
  }

  const AUTO_LAYOUT_GAP = 8;

  function visibleChildrenSorted(parentId){
    return childrenOf(parentId)
      .filter(isVisible)
      .sort((a,b) => {
        if(a.y !== b.y) return a.y - b.y;
        return a.x - b.x;
      });
  }

  function layoutLinearChildren(parentId, startY, gap=AUTO_LAYOUT_GAP){
    let cursorY = startY;
    const children = visibleChildrenSorted(parentId);

    children.forEach(child => {
      child.y = Math.round(cursorY);
      cursorY += child.h + gap;

      // Si el hijo está desplegado, sus descendientes visibles ocupan
      // inmediatamente el espacio siguiente. De esta forma no quedan huecos.
      if(!state.collapsedNodes[child.id]){
        const visibleGrandchildren = visibleChildrenSorted(child.id);
        if(visibleGrandchildren.length){
          cursorY = layoutLinearChildren(child.id, cursorY, gap);
        }
      }
    });

    return cursorY;
  }

  function topFacultyAncestor(node){
    let current = node;

    while(current?.parent){
      const parent = byId(current.parent);
      if(!parent) return null;
      if(parent.id === "facultades") return current;
      current = parent;
    }

    return null;
  }

  function compactFacultyColumn(faculty){
    if(!faculty) return;
    // Los encabezados de Facultad están en y=460 y tienen 60px.
    // 15px conserva el aire visual del organigrama original.
    layoutLinearChildren(faculty.id, faculty.y + faculty.h + 15, 7);
  }

  function compactGroup(groupName){
    if(!state.expanded[groupName]) return;

    const rootId = Object.keys(GROUP_BY_CORE)
      .find(id => GROUP_BY_CORE[id] === groupName);

    const root = rootId ? byId(rootId) : null;
    if(!root) return;

    if(groupName === "facultades"){
      childrenOf("facultades")
        .filter(isVisible)
        .forEach(compactFacultyColumn);
      return;
    }

    // Rectoría conserva una composición lateral, no una lista vertical.
    // Por eso no se fuerza su distribución automática.
    if(groupName === "rectoria") return;

    layoutLinearChildren(root.id, root.y + root.h + 33, AUTO_LAYOUT_GAP);
  }

  function compactAfterToggle(node){
    const group = GROUP_BY_CORE[node.id] || node.group || nodeBranch(node);

    if(group === "facultades"){
      if(node.id === "facultades"){
        compactGroup("facultades");
      }else{
        compactFacultyColumn(topFacultyAncestor(node));
      }
      return;
    }

    if(["desarrollo-social","cultura-bienestar","investigacion","vacademica","administrativa"].includes(group)){
      compactGroup(group);
    }
  }

  function compactAllExpandedGroups(){
    ["desarrollo-social","cultura-bienestar","investigacion","vacademica","administrativa","facultades"]
      .forEach(compactGroup);
  }

  function toggleNodeExpansion(node){
    const group = GROUP_BY_CORE[node.id];

    if(group){
      state.expanded[group] = !state.expanded[group];

      // Cuando se abre una rama completa, se compacta antes de dibujarla.
      if(state.expanded[group]) compactAfterToggle(node);

      saveState();
      render();
      return;
    }

    if(childrenOf(node.id).length){
      state.collapsedNodes[node.id] = !state.collapsedNodes[node.id];

      // Tanto al abrir como al cerrar, los elementos que siguen se corren
      // automáticamente hacia arriba/abajo para ocupar el espacio correcto.
      compactAfterToggle(node);

      saveState();
      render();
    }
  }

  function onNodeClick(ev,node){
    ev.stopPropagation();
    // La edición está siempre disponible. Un clic selecciona la casilla;
    // el botón +/− se encarga de desplegar/contraer sin desactivar el arrastre.
    selectNode(node.id);
  }

  function selectNode(id){
    selectedId = id;
    selectedLinkChildId = null;
    render();
  }

  function selectLink(childId){
    selectedId = null;
    selectedLinkChildId = childId;
    render();
  }

  function updateEditButtons(){
    const node = selectedId ? byId(selectedId) : null;
    const hasNode = !!node;
    const hasEditableLink = !!selectedLinkChildId || !!(node && node.parent);

    renameBtn.disabled = !hasNode;
    parentBtn.disabled = !hasNode || !node.parent || PROTECTED_NODES.has(node.id);
    linkBtn.disabled = !hasEditableLink;
    deleteBtn.disabled = !hasNode || PROTECTED_NODES.has(node.id);
  }

  function startDrag(ev,node,el){
    if(ev.button !== 0) return;
    ev.preventDefault();
    selectNodeWithoutRender(node.id);

    const rect = canvas.getBoundingClientRect();
    const branch = [node, ...descendantsOf(node.id)];
    const startPositions = new Map(
      branch.map(item => [item.id, {x:item.x, y:item.y}])
    );

    drag = {
      id:node.id,
      branchIds:branch.map(item => item.id),
      startPositions,
      pointerId:ev.pointerId,
      startClientX:ev.clientX,
      startClientY:ev.clientY,
      startX:node.x,
      startY:node.y,
      minStartX:Math.min(...branch.map(item => item.x)),
      minStartY:Math.min(...branch.map(item => item.y)),
      canvasScale:rect.width / CANVAS_WIDTH
    };

    el.setPointerCapture(ev.pointerId);
    el.addEventListener("pointermove", moveDrag);
    el.addEventListener("pointerup", endDrag, {once:true});
    el.addEventListener("pointercancel", endDrag, {once:true});
  }

  function selectNodeWithoutRender(id){
    selectedId = id;
    selectedLinkChildId = null;
    document.querySelectorAll(".org-node").forEach(el => {
      el.classList.toggle("selected",el.dataset.id === id);
    });
    drawConnections();
    updateEditButtons();
  }

  function moveDrag(ev){
    if(!drag || ev.pointerId !== drag.pointerId) return;
    const root = byId(drag.id);
    if(!root) return;

    const scale = drag.canvasScale || 1;
    const rawDx = (ev.clientX - drag.startClientX)/scale;
    const rawDy = (ev.clientY - drag.startClientY)/scale;

    // Snap calculado desde la casilla que se está agarrando.
    const snappedRootX = Math.round((drag.startX + rawDx)/GRID)*GRID;
    const snappedRootY = Math.round((drag.startY + rawDy)/GRID)*GRID;
    let deltaX = snappedRootX - drag.startX;
    let deltaY = snappedRootY - drag.startY;

    // Evita sacar cualquier descendiente fuera del lienzo por arriba/izquierda.
    deltaX = Math.max(deltaX, 5 - drag.minStartX);
    deltaY = Math.max(deltaY, 5 - drag.minStartY);

    // MUY IMPORTANTE: cada posición se recalcula desde la foto inicial del drag,
    // para que toda la rama se mueva exactamente junta y no acumule errores.
    drag.branchIds.forEach(id => {
      const item = byId(id);
      const start = drag.startPositions.get(id);
      if(!item || !start) return;

      item.x = start.x + deltaX;
      item.y = start.y + deltaY;

      const itemEl = document.querySelector(`.org-node[data-id="${CSS.escape(id)}"]`);
      if(itemEl){
        itemEl.style.left = item.x + "px";
        itemEl.style.top = item.y + "px";
      }
    });

    resizeCanvas();
    drawConnections();
  }

  function endDrag(ev){
    if(!drag) return;
    const el = ev.currentTarget;
    try{ el.releasePointerCapture(drag.pointerId); }catch(e){}
    el.removeEventListener("pointermove", moveDrag);
    drag = null;
    saveState();
    drawConnections();
  }

  function nodeRect(node){
    return {
      x:node.x, y:node.y, w:node.w, h:node.h,
      cx:node.x+node.w/2, cy:node.y+node.h/2
    };
  }

  function resolveAutoSides(parent, child, sourceSide, targetSide){
    const p=nodeRect(parent), c=nodeRect(child);
    const dx=c.cx-p.cx, dy=c.cy-p.cy;

    if(sourceSide === "auto" && targetSide === "auto"){
      if(Math.abs(dx) > Math.abs(dy)*1.25){
        return dx >= 0
          ? {source:"right", target:"left"}
          : {source:"left", target:"right"};
      }
      return dy >= 0
        ? {source:"bottom", target:"top"}
        : {source:"top", target:"bottom"};
    }

    const opposite = {top:"bottom",bottom:"top",left:"right",right:"left"};

    if(sourceSide === "auto"){
      if(targetSide !== "auto") sourceSide = opposite[targetSide];
      else sourceSide = dy >= 0 ? "bottom" : "top";
    }

    if(targetSide === "auto"){
      targetSide = opposite[sourceSide] || (dy >= 0 ? "top" : "bottom");
    }

    return {source:sourceSide, target:targetSide};
  }

  function anchorPoint(rect, side){
    if(side === "top") return {x:rect.cx, y:rect.y};
    if(side === "bottom") return {x:rect.cx, y:rect.y+rect.h};
    if(side === "left") return {x:rect.x, y:rect.cy};
    return {x:rect.x+rect.w, y:rect.cy}; // right
  }

  function pathFor(parent, child){
    const p=nodeRect(parent), c=nodeRect(child);
    let sourceSide = child.sourceSide || "auto";
    let targetSide = child.targetSide || "auto";

    // Si el usuario no ha fijado manualmente el anclaje, estas dos ramas
    // siempre salen desde abajo para conservar la lectura limpia del organigrama.
    if(sourceSide === "auto" && ["academico","facultades"].includes(parent.id)){
      sourceSide = "bottom";
      if(targetSide === "auto") targetSide = "top";
    }

    const sides = resolveAutoSides(
      parent,
      child,
      sourceSide,
      targetSide
    );

    const a = anchorPoint(p, sides.source);
    const b = anchorPoint(c, sides.target);
    const sourceHorizontal = ["left","right"].includes(sides.source);
    const targetHorizontal = ["left","right"].includes(sides.target);

    if(sourceHorizontal && targetHorizontal){
      const midX = a.x + (b.x-a.x)*0.5;
      return `M ${a.x} ${a.y} H ${midX} V ${b.y} H ${b.x}`;
    }

    if(!sourceHorizontal && !targetHorizontal){
      const midY = a.y + (b.y-a.y)*0.5;
      return `M ${a.x} ${a.y} V ${midY} H ${b.x} V ${b.y}`;
    }

    if(sourceHorizontal){
      return `M ${a.x} ${a.y} H ${b.x} V ${b.y}`;
    }

    return `M ${a.x} ${a.y} V ${b.y} H ${b.x}`;
  }

  function drawConnections(){
    const visibleIds = new Set(state.nodes.filter(isVisible).map(n=>n.id));
    const height = parseFloat(canvas.style.height) || canvas.clientHeight || 650;

    svg.setAttribute("viewBox",`0 0 ${CANVAS_WIDTH} ${height}`);
    svg.innerHTML="";

    state.nodes.forEach(node => {
      if(!visibleIds.has(node.id) || !node.parent || !visibleIds.has(node.parent)) return;
      const parent=byId(node.parent);
      if(!parent) return;

      const d = pathFor(parent,node);

      // Línea invisible más ancha para que sea fácil seleccionarla con el mouse.
      const hit=document.createElementNS("http://www.w3.org/2000/svg","path");
      hit.setAttribute("d",d);
      hit.setAttribute("class","connector-hit");
      hit.dataset.childId=node.id;
      hit.addEventListener("click",ev=>{
        ev.stopPropagation();
        selectLink(node.id);
      });
      svg.appendChild(hit);

      const path=document.createElementNS("http://www.w3.org/2000/svg","path");
      path.setAttribute("d",d);

      let cls="connector";
      if(node.relation==="advisory") cls += " advisory";

      // Las líneas que bajan desde Consejo Académico conservan el verde institucional.
      // El color de rama se aplica en los niveles internos.
      if(node.group !== "core"){
        const br=nodeBranch(node);
        if(connectionBranchClass[br]) cls += " "+connectionBranchClass[br];
      }

      if(selectedLinkChildId === node.id) cls += " selected-link";
      path.setAttribute("class",cls);

      const title=document.createElementNS("http://www.w3.org/2000/svg","title");
      title.textContent=`${parent.label.replaceAll("\n"," ")} → ${node.label.replaceAll("\n"," ")}`;
      path.appendChild(title);

      svg.appendChild(path);
    });
  }

  function resizeCanvas(){
    const visible = state.nodes.filter(isVisible);
    let maxY=610;
    visible.forEach(n => maxY=Math.max(maxY,n.y+n.h+70));
    canvas.style.height=Math.min(Math.max(maxY,650),2200)+"px";
    updateZoomStage();
  }

  function clampZoom(value){
    return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
  }

  function updateZoomStage(){
    const zoom = clampZoom(state.zoom || 1);
    const logicalHeight = parseFloat(canvas.style.height) || 650;

    canvas.style.transform = `scale(${zoom})`;
    stage.style.width = (CANVAS_WIDTH * zoom) + "px";
    stage.style.height = (logicalHeight * zoom) + "px";
    zoomValue.textContent = Math.round(zoom * 100) + "%";

    zoomOutBtn.disabled = zoom <= MIN_ZOOM + 0.001;
    zoomInBtn.disabled = zoom >= MAX_ZOOM - 0.001;
  }

  function setZoom(value, persist=true){
    state.zoom = clampZoom(Math.round(value * 100) / 100);
    updateZoomStage();
    if(persist) saveState();
  }

  function fitToWidth(){
    const available = Math.max(320, shell.clientWidth - 24);
    // "Ajustar" reduce cuando hace falta, pero no agranda por encima del 100 %.
    setZoom(Math.min(1, available / CANVAS_WIDTH));
    shell.scrollTo({left:0, top:0, behavior:"smooth"});
  }

  function rgbaOrFallback(value, fallback){
    if(!value || value === "none" || value === "transparent" || value === "rgba(0, 0, 0, 0)"){
      return fallback;
    }
    return value;
  }

  function roundedRectPath(ctx, x, y, w, h, radius){
    const r = Math.max(0, Math.min(Number(radius) || 0, w/2, h/2));

    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
  }

  function wrapTextForCanvas(ctx, text, maxWidth){
    const paragraphs = String(text || "").split("\n");
    const lines = [];

    paragraphs.forEach(paragraph => {
      const clean = paragraph.trim();

      if(!clean){
        lines.push("");
        return;
      }

      const words = clean.split(/\s+/);
      let current = "";

      words.forEach(word => {
        const test = current ? current + " " + word : word;

        if(current && ctx.measureText(test).width > maxWidth){
          lines.push(current);
          current = word;
        }else{
          current = test;
        }
      });

      if(current) lines.push(current);
    });

    return lines;
  }

  function drawConnectorToExport(ctx, path, offsetX=0, offsetY=0){
    const d = path.getAttribute("d");
    if(!d) return;

    const style = getComputedStyle(path);
    const stroke = rgbaOrFallback(style.stroke, "#2c7a45");
    const width = parseFloat(style.strokeWidth) || 1.6;

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.lineCap = "butt";
    ctx.lineJoin = "miter";

    const dash = style.strokeDasharray;
    if(dash && dash !== "none"){
      const values = dash
        .split(/[ ,]+/)
        .map(Number)
        .filter(Number.isFinite);

      if(values.length) ctx.setLineDash(values);
    }

    try{
      ctx.stroke(new Path2D(d));
    }catch(error){
      console.warn("No se pudo dibujar un enlace en el PNG:", error);
    }

    ctx.restore();
  }

  function drawModelFrameToExport(ctx, frame, offsetX=0, offsetY=0){
    const style = getComputedStyle(frame);
    const x = (parseFloat(frame.style.left) || frame.offsetLeft) + offsetX;
    const y = (parseFloat(frame.style.top) || frame.offsetTop) + offsetY;
    const w = parseFloat(frame.style.width) || frame.offsetWidth;
    const h = parseFloat(frame.style.height) || frame.offsetHeight;

    const radius = parseFloat(style.borderTopLeftRadius) || 0;
    const borderWidth = parseFloat(style.borderTopWidth) || 1;
    const fill = rgbaOrFallback(style.backgroundColor, "#f4f4f4");
    const border = rgbaOrFallback(style.borderTopColor, "#b9b9b9");

    roundedRectPath(ctx, x, y, w, h, radius);
    ctx.fillStyle = fill;
    ctx.fill();

    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = border;
    ctx.stroke();

    ctx.save();
    ctx.fillStyle = rgbaOrFallback(style.color, "#5b5b5b");
    ctx.font = `${style.fontWeight || "700"} ${style.fontSize || "18px"} ${style.fontFamily || "Arial"}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(frame.textContent || "", x+w/2, y+14);
    ctx.restore();
  }

  function drawNodeToExport(ctx, el, offsetX=0, offsetY=0){
    const style = getComputedStyle(el);
    const node = byId(el.dataset.id);

    const x = (parseFloat(el.style.left) || el.offsetLeft) + offsetX;
    const y = (parseFloat(el.style.top) || el.offsetTop) + offsetY;
    const w = parseFloat(el.style.width) || el.offsetWidth;
    const h = parseFloat(el.style.height) || el.offsetHeight;

    const radius = parseFloat(style.borderTopLeftRadius) || 0;
    const borderWidth = parseFloat(style.borderTopWidth) || 0;
    const fill = rgbaOrFallback(style.backgroundColor, "#ffffff");
    const border = rgbaOrFallback(style.borderTopColor, "#9abb9f");

    ctx.save();

    roundedRectPath(ctx, x, y, w, h, radius);
    ctx.fillStyle = fill;
    ctx.fill();

    if(borderWidth > 0 && style.borderTopStyle !== "none"){
      ctx.lineWidth = borderWidth;
      ctx.strokeStyle = border;

      if(style.borderTopStyle === "dashed"){
        ctx.setLineDash([5,4]);
      }

      ctx.stroke();
      ctx.setLineDash([]);
    }

    const fontSize = parseFloat(style.fontSize) || 14;
    const fontWeight = style.fontWeight || "680";
    const fontFamily = style.fontFamily || 'Arial, sans-serif';
    const lineHeightRaw = parseFloat(style.lineHeight);
    const lineHeight = Number.isFinite(lineHeightRaw) ? lineHeightRaw : fontSize * 1.12;

    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = rgbaOrFallback(style.color, "#263028");
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const label = node ? node.label : (el.querySelector(".label")?.textContent || el.textContent || "");
    const maxTextWidth = Math.max(20, w - 18);
    const lines = wrapTextForCanvas(ctx, label, maxTextWidth);

    const totalHeight = Math.max(lineHeight, lines.length * lineHeight);
    const firstY = y + h/2 - totalHeight/2 + lineHeight/2;

    lines.forEach((line, index) => {
      ctx.fillText(line, x+w/2, firstY + index*lineHeight);
    });

    ctx.restore();
  }

  function exportBounds(){
    const PADDING = 28;
    const items = [];

    nodesLayer.querySelectorAll(".org-node, .model-frame").forEach(el => {
      const x = parseFloat(el.style.left) || el.offsetLeft || 0;
      const y = parseFloat(el.style.top) || el.offsetTop || 0;
      const w = parseFloat(el.style.width) || el.offsetWidth || 0;
      const h = parseFloat(el.style.height) || el.offsetHeight || 0;
      items.push({minX:x, minY:y, maxX:x+w, maxY:y+h});
    });

    // Los enlaces terminan en las cajas, de manera que el rectángulo de cajas
    // también delimita el espacio necesario para dibujar las líneas.

    if(!items.length){
      return {
        minX:0, minY:0,
        maxX:CANVAS_WIDTH, maxY:Math.round(parseFloat(canvas.style.height) || 650),
        width:CANVAS_WIDTH, height:Math.round(parseFloat(canvas.style.height) || 650),
        offsetX:0, offsetY:0
      };
    }

    const minX = Math.floor(Math.min(...items.map(i => i.minX)));
    const minY = Math.floor(Math.min(...items.map(i => i.minY)));
    const maxX = Math.ceil(Math.max(...items.map(i => i.maxX)));
    const maxY = Math.ceil(Math.max(...items.map(i => i.maxY)));

    const width = Math.max(200, maxX - minX + PADDING*2);
    const height = Math.max(200, maxY - minY + PADDING*2);

    return {
      minX, minY, maxX, maxY,
      width, height,
      offsetX: PADDING - minX,
      offsetY: PADDING - minY
    };
  }

  function createOrganigramPngBlob(){
    return new Promise((resolve, reject) => {
      try{
        // Nos aseguramos de que el DOM y las líneas correspondan al estado actual.
        render();

        const bounds = exportBounds();

        const scale = 2;
        const output = document.createElement("canvas");
        output.width = Math.round(bounds.width * scale);
        output.height = Math.round(bounds.height * scale);

        const ctx = output.getContext("2d");
        if(!ctx){
          reject(new Error("El navegador no pudo crear el lienzo PNG."));
          return;
        }

        ctx.scale(scale, scale);

        // Fondo blanco.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, bounds.width, bounds.height);

        // 1. Dibuja los mismos enlaces jerárquicos que se ven en pantalla.
        ctx.save();
        ctx.translate(bounds.offsetX, bounds.offsetY);
        ctx.lineWidth=1.7;
        for(const node of state.nodes.filter(isVisible)){
          if(!node.parent) continue;
          const parent=byId(node.parent);
          if(!parent || !isVisible(parent)) continue;
          ctx.strokeStyle=currentPreset==="propuesta" ? "#7d48b0" : "#2c7a45";
          ctx.setLineDash(node.relation==="advisory" ? [5,5] : []);
          ctx.stroke(new Path2D(pathFor(parent,node)));
        }
        ctx.restore();

        // 2. Recuadros informativos.
        nodesLayer.querySelectorAll(".model-frame").forEach(frame => {
          drawModelFrameToExport(ctx, frame, bounds.offsetX, bounds.offsetY);
        });

        // 3. Casillas visibles.
        nodesLayer.querySelectorAll(".org-node").forEach(el => {
          drawNodeToExport(ctx, el, bounds.offsetX, bounds.offsetY);
        });

        output.toBlob(blob => {
          if(blob){
            resolve(blob);
          }else{
            reject(new Error("El navegador no pudo convertir el organigrama a PNG."));
          }
        }, "image/png");
      }catch(error){
        reject(error);
      }
    });
  }

  async function fallbackDownload(blob, filename){
    const url = URL.createObjectURL(blob);

    try{
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.rel = "noopener";
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => URL.revokeObjectURL(url), 15000);
    }catch(error){
      URL.revokeObjectURL(url);
      throw error;
    }
  }

  async function exportAsPng(){
    const originalLabel = exportBtn ? exportBtn.textContent : "";
    const timestamp = new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");
    const filename = `estructura-ipred-${currentPreset}-${timestamp}.png`;

    let fileHandle = null;

    // El selector se abre directamente desde el clic del usuario.
    // Esto funciona especialmente bien en Chrome/Edge sobre GitHub Pages (HTTPS).
    if(window.isSecureContext && "showSaveFilePicker" in window){
      try{
        fileHandle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [{
            description: "Imagen PNG",
            accept: {"image/png": [".png"]}
          }]
        });
      }catch(error){
        if(error?.name === "AbortError") return;
        console.warn("No se pudo usar Guardar como; se intentará descarga directa:", error);
      }
    }

    if(exportBtn){
      exportBtn.disabled = true;
      exportBtn.textContent = "⏳ Generando PNG...";
    }

    const prevSelectedId = selectedId;
    const prevSelectedLinkChildId = selectedLinkChildId;

    // La imagen no debe mostrar selección activa.
    selectedId = null;
    selectedLinkChildId = null;

    try{
      const pngBlob = await createOrganigramPngBlob();

      if(fileHandle){
        const writable = await fileHandle.createWritable();
        await writable.write(pngBlob);
        await writable.close();
      }else{
        await fallbackDownload(pngBlob, filename);
      }
    }catch(error){
      console.error("ERROR EXPORTANDO PNG:", error);

      // El mensaje incluye el error real para poder detectar cualquier caso de navegador.
      alert(
        "No fue posible guardar el PNG.\n\n" +
        (error?.message || String(error))
      );
    }finally{
      selectedId = prevSelectedId;
      selectedLinkChildId = prevSelectedLinkChildId;
      render();
      updateZoomStage();

      if(exportBtn){
        exportBtn.disabled = false;
        exportBtn.textContent = originalLabel || "💾 Guardar PNG";
      }
    }
  }

  function fillParents(excludeId=null){
    parentSelect.innerHTML="";

    state.nodes
      .filter(n => n.kind !== "model-frame")
      .forEach(n=>{
        if(n.id===excludeId) return;
        if(excludeId && isDescendant(excludeId,n.id)) return;

        const option=document.createElement("option");
        option.value=n.id;
        option.textContent=n.label.replaceAll("\n"," ");
        parentSelect.appendChild(option);
      });
  }

  function isDescendant(ancestorId, candidateId){
    let p=byId(candidateId)?.parent;
    while(p){
      if(p===ancestorId) return true;
      p=byId(p)?.parent || null;
    }
    return false;
  }

  function inheritedGroup(parent){
    if(!parent) return "core";
    if(parent.group!=="core") return parent.group;
    return GROUP_BY_CORE[parent.id] || "core";
  }

  function setDialogVisibility({
    label=true,
    parent=true,
    style=true,
    relation=true,
    anchors=false,
    newHint=false
  }={}){
    labelWrap.classList.toggle("is-hidden",!label);
    parentWrap.classList.toggle("is-hidden",!parent);
    styleWrap.classList.toggle("is-hidden",!style);
    relationWrap.classList.toggle("is-hidden",!relation);
    anchorWrap.classList.toggle("is-hidden",!anchors);
    newNodeHint.classList.toggle("is-hidden",!newHint);
  }

  function openAdd(){
    dialogMode="add";
    dialogTitle.textContent="Agregar nueva casilla";
    parentLabel.textContent="Depende de";
    setDialogVisibility({label:true,parent:true,style:false,relation:true,anchors:true,newHint:true});

    labelInput.value="";
    fillParents();
    parentSelect.value=selectedId || "academico";
    relationSelect.value="hierarchical";
    styleSelect.value="new";
    sourceSideSelect.value="auto";
    targetSideSelect.value="auto";

    dialog.showModal();
    setTimeout(()=>labelInput.focus(),30);
  }

  function openRename(){
    if(!selectedId) return;
    const node=byId(selectedId);
    if(!node) return;

    dialogMode="rename";
    dialogTitle.textContent="Editar casilla";
    parentLabel.textContent="Depende de";
    setDialogVisibility({label:true,parent:false,style:true,relation:true,anchors:false,newHint:false});

    labelInput.value=node.label.replaceAll("\n"," ");
    relationSelect.value=node.relation || "hierarchical";
    styleSelect.value=node.style || "normal";

    dialog.showModal();
    setTimeout(()=>labelInput.select(),30);
  }

  function openChangeParent(){
    if(!selectedId) return;
    const node=byId(selectedId);
    if(!node || !node.parent) return;

    dialogMode="parent";
    dialogTitle.textContent="Cambiar dependencia";
    parentLabel.textContent="Depende de";
    setDialogVisibility({label:true,parent:true,style:true,relation:true,anchors:true,newHint:false});

    labelInput.value=node.label.replaceAll("\n"," ");
    fillParents(selectedId);
    parentSelect.value=node.parent;
    relationSelect.value=node.relation || "hierarchical";
    styleSelect.value=node.style || "normal";
    sourceSideSelect.value=node.sourceSide || "auto";
    targetSideSelect.value=node.targetSide || "auto";

    dialog.showModal();
  }

  function openEditLink(){
    const childId = selectedLinkChildId || (selectedId && byId(selectedId)?.parent ? selectedId : null);
    if(!childId) return;

    const node=byId(childId);
    if(!node || !node.parent) return;

    selectedLinkChildId = childId;
    selectedId = null;

    dialogMode="link";
    dialogTitle.textContent="Editar enlace";
    parentLabel.textContent="La línea viene de";
    setDialogVisibility({label:false,parent:true,style:false,relation:true,anchors:true,newHint:false});

    // Se conserva el valor aunque el campo esté oculto.
    labelInput.value=node.label.replaceAll("\n"," ");
    fillParents(node.id);
    parentSelect.value=node.parent;
    relationSelect.value=node.relation || "hierarchical";
    sourceSideSelect.value=node.sourceSide || "auto";
    targetSideSelect.value=node.targetSide || "auto";

    dialog.showModal();
  }

  function saveDialog(){
    let node = selectedId ? byId(selectedId) : null;
    const cleanLabel=labelInput.value.trim().replace(/\s*\n\s*/g," ");

    if(dialogMode==="add"){
      if(!cleanLabel){labelInput.focus();return;}

      const parent=byId(parentSelect.value);
      if(!parent) return;

      const id="custom-"+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
      const group=inheritedGroup(parent);
      if(group!=="core") state.expanded[group]=true;

      const siblings=childrenOf(parent.id);
      const offset=siblings.length*18;

      state.nodes.push({
        id,
        label:cleanLabel,
        x:Math.max(10,parent.x+20+offset),
        y:parent.y+parent.h+65+offset,
        w:Math.max(190,Math.min(330,parent.w)),
        h:46,
        parent:parent.id,
        group,
        kind:"normal",
        relation:relationSelect.value,
        style:"new",             // Todo elemento recién creado queda amarillo
        sourceSide:
          sourceSideSelect.value === "auto" && ["academico","facultades"].includes(parent.id)
            ? "bottom"
            : sourceSideSelect.value,
        targetSide:
          targetSideSelect.value === "auto" && ["academico","facultades"].includes(parent.id)
            ? "top"
            : targetSideSelect.value,
        css:"",
        custom:true
      });

      selectedId=id;
      selectedLinkChildId=null;
    }

    else if(dialogMode==="rename"){
      if(!node || !cleanLabel){labelInput.focus();return;}
      node.label=cleanLabel;
      node.relation=relationSelect.value;
      node.style=styleSelect.value;
    }

    else if(dialogMode==="parent"){
      if(!node || !cleanLabel){labelInput.focus();return;}
      const newParent=byId(parentSelect.value);
      if(!newParent) return;

      node.label=cleanLabel;
      node.parent=newParent.id;
      node.group=inheritedGroup(newParent);
      node.relation=relationSelect.value;
      node.style=styleSelect.value;
      node.sourceSide =
        sourceSideSelect.value === "auto" && ["academico","facultades"].includes(newParent.id)
          ? "bottom"
          : sourceSideSelect.value;
      node.targetSide =
        targetSideSelect.value === "auto" && ["academico","facultades"].includes(newParent.id)
          ? "top"
          : targetSideSelect.value;

      if(node.group!=="core") state.expanded[node.group]=true;
    }

    else if(dialogMode==="link"){
      const childId = selectedLinkChildId;
      node = byId(childId);
      if(!node) return;

      const newParent=byId(parentSelect.value);
      if(!newParent) return;

      node.parent=newParent.id;
      node.group=inheritedGroup(newParent);
      node.relation=relationSelect.value;
      node.sourceSide =
        sourceSideSelect.value === "auto" && ["academico","facultades"].includes(newParent.id)
          ? "bottom"
          : sourceSideSelect.value;
      node.targetSide =
        targetSideSelect.value === "auto" && ["academico","facultades"].includes(newParent.id)
          ? "top"
          : targetSideSelect.value;

      if(node.group!=="core") state.expanded[node.group]=true;
    }

    saveState();
    dialog.close();
    render();
  }

  function deleteSelected(){
    if(!selectedId) return;
    const node=byId(selectedId);
    if(!node) return;

    const descendants=[];
    const collect=id=>childrenOf(id).forEach(ch=>{descendants.push(ch.id);collect(ch.id)});
    collect(node.id);

    const extra=descendants.length
      ? `\nTambién se eliminarán ${descendants.length} casilla(s) dependiente(s).`
      : "";

    if(!confirm(`¿Eliminar “${node.label.replaceAll("\n"," ")}”?${extra}`)) return;

    const remove=new Set([selectedId,...descendants]);
    state.nodes=state.nodes.filter(n=>!remove.has(n.id));
    selectedId=null;
    selectedLinkChildId=null;
    saveState();
    render();
  }

  zoomOutBtn.addEventListener("click",()=>setZoom((state.zoom || 1) - ZOOM_STEP));
  zoomInBtn.addEventListener("click",()=>setZoom((state.zoom || 1) + ZOOM_STEP));
  fitBtn.addEventListener("click",fitToWidth);
  exportBtn?.addEventListener("click", exportAsPng);
  actualViewBtn?.addEventListener("click",()=>switchPreset("actual"));
  proposalViewBtn?.addEventListener("click",()=>switchPreset("propuesta"));

  addBtn.addEventListener("click",openAdd);
  renameBtn.addEventListener("click",openRename);
  parentBtn.addEventListener("click",openChangeParent);
  linkBtn.addEventListener("click",openEditLink);
  deleteBtn.addEventListener("click",deleteSelected);
  saveDialogBtn.addEventListener("click",saveDialog);

  expandBtn.addEventListener("click",()=>{
    state.expanded[currentPreset]=true;
    state.collapsedNodes={};
    saveState();
    render();
  });

  collapseBtn.addEventListener("click",()=>{
    state.expanded[currentPreset]=false;
    state.collapsedNodes={};
    selectedId=null;
    selectedLinkChildId=null;
    saveState();
    render();
  });

  resetBtn.addEventListener("click",()=>{
    if(!confirm("¿Restablecer el organigrama a la distribución inicial? Se eliminarán las casillas, enlaces y movimientos guardados.")) return;

    const currentZoom = state.zoom || 1;
    state=deepClone(baseState);
    state.zoom=currentZoom;
    selectedId=null;
    selectedLinkChildId=null;
    saveState();
    render();
  });

  canvas.addEventListener("click",()=>{
    selectedId=null;
    selectedLinkChildId=null;
    render();
  });

  window.addEventListener("resize",()=>{ updateZoomStage(); drawConnections(); });

  // Mover con flechas del teclado mientras se edita.
  window.addEventListener("keydown",ev=>{
    if(
      !selectedId ||
      ["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName)
    ) return;

    const node=byId(selectedId);
    if(!node) return;

    const step=ev.shiftKey?20:5;
    let dx=0, dy=0;

    if(ev.key==="ArrowLeft") dx=-step;
    else if(ev.key==="ArrowRight") dx=step;
    else if(ev.key==="ArrowUp") dy=-step;
    else if(ev.key==="ArrowDown") dy=step;
    else return;

    ev.preventDefault();
    moveBranch(selectedId, dx, dy);
    saveState();
    render();
  });

  updateViewHeader();
  updateViewButtons();
  render();

  requestAnimationFrame(()=>{
    if(!viewStates[currentPreset]) fitToWidth();
    shell.scrollLeft=0;
    updateZoomStage();
  });
})();
