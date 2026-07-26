import React, { useState } from 'react';
import { Plus, Trash2, Edit3, ArrowUp, ArrowDown, Clock, Baby, Users, Save, Sparkles, Image, Check, AlertCircle } from 'lucide-react';

interface DailyExperienceScheduleManagerProps {
  content: any;
  setContent: (newContent: any) => void;
  activeLang: 'en' | 'am';
  onSave?: () => void;
  onUploadImage?: (path: string[], file: File) => Promise<void>;
}

export const DailyExperienceScheduleManager: React.FC<DailyExperienceScheduleManagerProps> = ({
  content,
  setContent,
  activeLang,
  onSave
}) => {
  const dailyExpEn = content.en?.dailyExperience || {};
  const dailyExpAm = content.am?.dailyExperience || {};

  // Get schedules or initialize from fallback
  const schedulesEn = dailyExpEn.schedules && dailyExpEn.schedules.length > 0
    ? dailyExpEn.schedules
    : [
        {
          id: 'infants',
          name: 'Infants',
          nameAm: 'ሕፃናት',
          ageRange: '3 to 12 Months',
          ageRangeAm: 'ከ 3 እስከ 12 ወራት',
          description: 'Nurturing care, sensory play, personalized feeding, and peaceful sleep routines.',
          descriptionAm: 'ለቀዳሚ እድሜ ታዳጊዎቻችን ፍቅር የተሞላበት እንክብካቤ፣ የስሜት ህዋሳት እንቅስቃሴዎች፣ አመጋገብ እና ሰላማዊ የእረፍት ጊዜ።',
          timeline: dailyExpEn.timeline || []
        }
      ];

  const [selectedClassId, setSelectedClassId] = useState<string>(schedulesEn[0]?.id || 'infants');
  const [editingClass, setEditingClass] = useState<any | null>(null);
  const [isAddingClass, setIsAddingClass] = useState(false);
  
  // New class form state
  const [newClassForm, setNewClassForm] = useState({
    name: '',
    nameAm: '',
    ageRange: '',
    ageRangeAm: '',
    description: '',
    descriptionAm: ''
  });

  const activeIndex = schedulesEn.findIndex((s: any) => s.id === selectedClassId);
  const currentClass = schedulesEn[activeIndex !== -1 ? activeIndex : 0] || schedulesEn[0];

  // Helper to deep clone and update schedules in both EN and AM content
  const updateSchedules = (newSchedules: any[]) => {
    const updatedContent = JSON.parse(JSON.stringify(content));
    
    if (!updatedContent.en.dailyExperience) updatedContent.en.dailyExperience = {};
    if (!updatedContent.am.dailyExperience) updatedContent.am.dailyExperience = {};

    updatedContent.en.dailyExperience.schedules = newSchedules;
    updatedContent.am.dailyExperience.schedules = newSchedules;

    setContent(updatedContent);
  };

  // Add new class
  const handleAddClass = () => {
    if (!newClassForm.name.trim()) return;

    const classId = newClassForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);
    const newClassObj = {
      id: classId,
      name: newClassForm.name,
      nameAm: newClassForm.nameAm || newClassForm.name,
      ageRange: newClassForm.ageRange || 'All Ages',
      ageRangeAm: newClassForm.ageRangeAm || newClassForm.ageRange || 'ሁሉም የዕድሜ ክልሎች',
      description: newClassForm.description || '',
      descriptionAm: newClassForm.descriptionAm || newClassForm.description || '',
      timeline: [
        {
          time: '8:00 AM - 9:00 AM',
          activity: 'Welcome and morning routine',
          activityAm: 'አቀባበል እና የጠዋት እንቅስቃሴ',
          image: ''
        }
      ]
    };

    const newSchedules = [...schedulesEn, newClassObj];
    updateSchedules(newSchedules);
    setSelectedClassId(classId);
    setIsAddingClass(false);
    setNewClassForm({
      name: '',
      nameAm: '',
      ageRange: '',
      ageRangeAm: '',
      description: '',
      descriptionAm: ''
    });
  };

  // Delete Class
  const handleDeleteClass = (id: string) => {
    if (schedulesEn.length <= 1) {
      alert('You must have at least one age group or class schedule.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this age group schedule?')) return;

    const newSchedules = schedulesEn.filter((s: any) => s.id !== id);
    updateSchedules(newSchedules);
    if (selectedClassId === id) {
      setSelectedClassId(newSchedules[0]?.id || '');
    }
  };

  // Save Class Details Modal
  const handleSaveClassDetails = () => {
    if (!editingClass) return;

    const newSchedules = schedulesEn.map((s: any) => {
      if (s.id === editingClass.id) {
        return {
          ...s,
          name: editingClass.name,
          nameAm: editingClass.nameAm,
          ageRange: editingClass.ageRange,
          ageRangeAm: editingClass.ageRangeAm,
          description: editingClass.description,
          descriptionAm: editingClass.descriptionAm
        };
      }
      return s;
    });

    updateSchedules(newSchedules);
    setEditingClass(null);
  };

  // Move Class Order
  const handleMoveClass = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= schedulesEn.length) return;

    const newSchedules = [...schedulesEn];
    const temp = newSchedules[index];
    newSchedules[index] = newSchedules[targetIndex];
    newSchedules[targetIndex] = temp;

    updateSchedules(newSchedules);
  };

  // Timeline Item Handlers
  const handleUpdateTimelineItem = (slotIdx: number, field: string, val: string) => {
    const newSchedules = JSON.parse(JSON.stringify(schedulesEn));
    const targetClass = newSchedules.find((s: any) => s.id === currentClass.id);
    if (!targetClass) return;

    if (!targetClass.timeline[slotIdx]) return;
    targetClass.timeline[slotIdx][field] = val;

    updateSchedules(newSchedules);
  };

  const handleAddTimelineItem = () => {
    const newSchedules = JSON.parse(JSON.stringify(schedulesEn));
    const targetClass = newSchedules.find((s: any) => s.id === currentClass.id);
    if (!targetClass) return;

    targetClass.timeline.push({
      time: '12:00 PM - 1:00 PM',
      activity: 'New activity session',
      activityAm: 'አዲስ የመማሪያ እና የእንቅስቃሴ ክፍል',
      image: ''
    });

    updateSchedules(newSchedules);
  };

  const handleDeleteTimelineItem = (slotIdx: number) => {
    const newSchedules = JSON.parse(JSON.stringify(schedulesEn));
    const targetClass = newSchedules.find((s: any) => s.id === currentClass.id);
    if (!targetClass) return;

    targetClass.timeline.splice(slotIdx, 1);
    updateSchedules(newSchedules);
  };

  const handleMoveTimelineItem = (slotIdx: number, direction: 'up' | 'down') => {
    const newSchedules = JSON.parse(JSON.stringify(schedulesEn));
    const targetClass = newSchedules.find((s: any) => s.id === currentClass.id);
    if (!targetClass) return;

    const targetIdx = direction === 'up' ? slotIdx - 1 : slotIdx + 1;
    if (targetIdx < 0 || targetIdx >= targetClass.timeline.length) return;

    const temp = targetClass.timeline[slotIdx];
    targetClass.timeline[slotIdx] = targetClass.timeline[targetIdx];
    targetClass.timeline[targetIdx] = temp;

    updateSchedules(newSchedules);
  };

  return (
    <div className="space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm">
      
      {/* Header & Section Title Edit */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-green/10 text-brand-green text-xs font-black rounded-full mb-2 uppercase tracking-wider">
            <Baby size={14} />
            <span>Age-Based Class Schedules</span>
          </div>
          <h2 className="text-2xl font-bold text-stone-900 font-editorial">
            Manage "A Day at Kidtopia" Schedules
          </h2>
          <p className="text-stone-500 text-sm mt-1">
            Configure different daily routines for Infants, Toddlers, Preschools, or add custom classes.
          </p>
        </div>

        {onSave && (
          <button
            onClick={onSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-orange text-white font-bold rounded-2xl shadow-md hover:bg-brand-orange/90 transition-all cursor-pointer self-start md:self-center"
          >
            <Save size={18} />
            <span>Save All Changes</span>
          </button>
        )}
      </div>

      {/* Class / Age Group Switcher Tabs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="text-xs font-black uppercase tracking-wider text-stone-500">
            Select Class / Age Group to Edit ({schedulesEn.length})
          </label>
          <button
            onClick={() => setIsAddingClass(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-brand-green/10 text-brand-green hover:bg-brand-green/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Additional Class</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {schedulesEn.map((sched: any, idx: number) => {
            const isSelected = sched.id === selectedClassId;
            return (
              <div
                key={sched.id}
                className={`group flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-brand-green text-white border-brand-green shadow-sm'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
                onClick={() => setSelectedClassId(sched.id)}
              >
                <span>{sched.name} ({sched.ageRange})</span>
                
                <div className="flex items-center gap-1 ml-1 opacity-80 group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingClass({ ...sched });
                    }}
                    title="Edit Class Details"
                    className={`p-1 rounded-lg transition-colors ${
                      isSelected ? 'hover:bg-white/20 text-white' : 'hover:bg-stone-200 text-stone-600'
                    }`}
                  >
                    <Edit3 size={13} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveClass(idx, 'up');
                    }}
                    disabled={idx === 0}
                    title="Move Left"
                    className={`p-1 rounded-lg transition-colors disabled:opacity-30 ${
                      isSelected ? 'hover:bg-white/20 text-white' : 'hover:bg-stone-200 text-stone-600'
                    }`}
                  >
                    <ArrowUp size={13} className="-rotate-90" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClass(sched.id);
                    }}
                    title="Delete Class"
                    className={`p-1 rounded-lg transition-colors ${
                      isSelected ? 'hover:bg-red-500/30 text-white' : 'hover:bg-red-100 text-red-600'
                    }`}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add New Class Modal / Form */}
      {isAddingClass && (
        <div className="p-6 bg-emerald-50/60 rounded-3xl border border-emerald-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 flex items-center gap-2">
              <Plus size={18} className="text-brand-green" />
              Add New Class / Age Group
            </h3>
            <button
              onClick={() => setIsAddingClass(false)}
              className="text-stone-400 hover:text-stone-600 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Class Name (English)</label>
              <input
                type="text"
                placeholder="e.g., Pre-K, Nursery, Summer Camp"
                value={newClassForm.name}
                onChange={(e) => setNewClassForm({ ...newClassForm, name: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-brand-green"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Class Name (Amharic)</label>
              <input
                type="text"
                placeholder="e.g., ቅድመ-መዋዕለ ሕፃናት"
                value={newClassForm.nameAm}
                onChange={(e) => setNewClassForm({ ...newClassForm, nameAm: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-brand-green"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Age Range (English)</label>
              <input
                type="text"
                placeholder="e.g., 4 to 5 Years"
                value={newClassForm.ageRange}
                onChange={(e) => setNewClassForm({ ...newClassForm, ageRange: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-brand-green"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Age Range (Amharic)</label>
              <input
                type="text"
                placeholder="e.g., ከ 4 እስከ 5 ዓመት"
                value={newClassForm.ageRangeAm}
                onChange={(e) => setNewClassForm({ ...newClassForm, ageRangeAm: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-brand-green"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-600 mb-1">Description (English)</label>
              <textarea
                rows={2}
                placeholder="Describe the philosophy and routine for this age group..."
                value={newClassForm.description}
                onChange={(e) => setNewClassForm({ ...newClassForm, description: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-brand-green"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-600 mb-1">Description (Amharic)</label>
              <textarea
                rows={2}
                placeholder="ስለዚህ ክፍል መርሃግብር እና እንክብካቤ ማብራሪያ..."
                value={newClassForm.descriptionAm}
                onChange={(e) => setNewClassForm({ ...newClassForm, descriptionAm: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-brand-green"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsAddingClass(false)}
              className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleAddClass}
              className="px-5 py-2 text-xs font-bold bg-brand-green text-white rounded-xl shadow hover:bg-brand-green/90"
            >
              Add Class
            </button>
          </div>
        </div>
      )}

      {/* Edit Class Details Modal */}
      {editingClass && (
        <div className="p-6 bg-amber-50/70 rounded-3xl border border-amber-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 flex items-center gap-2">
              <Edit3 size={18} className="text-brand-orange" />
              Edit Class Info: {editingClass.name}
            </h3>
            <button
              onClick={() => setEditingClass(null)}
              className="text-stone-400 hover:text-stone-600 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Class Name (English)</label>
              <input
                type="text"
                value={editingClass.name}
                onChange={(e) => setEditingClass({ ...editingClass, name: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-brand-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Class Name (Amharic)</label>
              <input
                type="text"
                value={editingClass.nameAm || ''}
                onChange={(e) => setEditingClass({ ...editingClass, nameAm: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-brand-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Age Range (English)</label>
              <input
                type="text"
                value={editingClass.ageRange || ''}
                onChange={(e) => setEditingClass({ ...editingClass, ageRange: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-brand-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Age Range (Amharic)</label>
              <input
                type="text"
                value={editingClass.ageRangeAm || ''}
                onChange={(e) => setEditingClass({ ...editingClass, ageRangeAm: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-brand-orange"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-600 mb-1">Description (English)</label>
              <textarea
                rows={2}
                value={editingClass.description || ''}
                onChange={(e) => setEditingClass({ ...editingClass, description: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-brand-orange"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-600 mb-1">Description (Amharic)</label>
              <textarea
                rows={2}
                value={editingClass.descriptionAm || ''}
                onChange={(e) => setEditingClass({ ...editingClass, descriptionAm: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-brand-orange"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setEditingClass(null)}
              className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveClassDetails}
              className="px-5 py-2 text-xs font-bold bg-brand-orange text-white rounded-xl shadow hover:bg-brand-orange/90"
            >
              Save Class Details
            </button>
          </div>
        </div>
      )}

      {/* Timeline Slot List for Currently Selected Class */}
      {currentClass && (
        <div className="space-y-6 pt-2">
          <div className="flex items-center justify-between bg-stone-50 p-4 rounded-2xl border border-stone-200">
            <div>
              <span className="text-xs font-black uppercase text-brand-green tracking-wider">Active Class</span>
              <h3 className="text-lg font-bold text-stone-900">
                {currentClass.name} <span className="text-sm font-normal text-stone-500">({currentClass.ageRange})</span>
              </h3>
            </div>

            <button
              onClick={handleAddTimelineItem}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-green text-white text-xs font-bold rounded-xl shadow hover:bg-brand-green/90 transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>Add Schedule Slot</span>
            </button>
          </div>

          {/* Slots List */}
          <div className="space-y-4">
            {currentClass.timeline && currentClass.timeline.length > 0 ? (
              currentClass.timeline.map((slot: any, slotIdx: number) => (
                <div
                  key={slotIdx}
                  className="p-5 bg-stone-50/80 rounded-2xl border border-stone-200/90 hover:border-brand-green/40 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-green/10 text-brand-green text-xs font-black flex items-center justify-center">
                      {slotIdx + 1}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveTimelineItem(slotIdx, 'up')}
                        disabled={slotIdx === 0}
                        title="Move Up"
                        className="p-1.5 text-stone-500 hover:text-stone-800 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        onClick={() => handleMoveTimelineItem(slotIdx, 'down')}
                        disabled={slotIdx === currentClass.timeline.length - 1}
                        title="Move Down"
                        className="p-1.5 text-stone-500 hover:text-stone-800 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTimelineItem(slotIdx)}
                        title="Delete Slot"
                        className="p-1.5 text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                        Time Slot
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 7:30 AM - 9:00 AM"
                        value={slot.time || ''}
                        onChange={(e) => handleUpdateTimelineItem(slotIdx, 'time', e.target.value)}
                        className="w-full px-3 py-1.5 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-brand-green font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                        Activity (English)
                      </label>
                      <input
                        type="text"
                        placeholder="Activity description in English..."
                        value={slot.activity || ''}
                        onChange={(e) => handleUpdateTimelineItem(slotIdx, 'activity', e.target.value)}
                        className="w-full px-3 py-1.5 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-brand-green font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                        Activity (Amharic)
                      </label>
                      <input
                        type="text"
                        placeholder="የእንቅስቃሴው ዝርዝር በአማርኛ..."
                        value={slot.activityAm || ''}
                        onChange={(e) => handleUpdateTimelineItem(slotIdx, 'activityAm', e.target.value)}
                        className="w-full px-3 py-1.5 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-brand-green font-medium"
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-6 bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-sm">
                No schedule slots for this class yet. Click "Add Schedule Slot" above.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
