"use client";
import { useState, useMemo } from 'react';
import { Plus, Trash2, Copy, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Course {
    id: string;
    grade: string;
    credits: string;
}

const gradePoints: Record<string, number> = {
    'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0
};

export function GPACalculator() {
    const [courses, setCourses] = useState<Course[]>([
        { id: '1', grade: 'A', credits: '3' },
        { id: '2', grade: 'B', credits: '3' }
    ]);
    const [copied, setCopied] = useState(false);

    const result = useMemo(() => {
        let totalPoints = 0;
        let totalCredits = 0;

        courses.forEach(c => {
            const pts = gradePoints[c.grade] || 0;
            const crd = parseFloat(c.credits) || 0;
            totalPoints += pts * crd;
            totalCredits += crd;
        });

        if (totalCredits === 0) return null;
        return (totalPoints / totalCredits).toFixed(2);
    }, [courses]);

    const addCourse = () => {
        setCourses([...courses, { id: Math.random().toString(), grade: 'A', credits: '3' }]);
    };

    const removeCourse = (id: string) => {
        if (courses.length > 1) {
            setCourses(courses.filter(c => c.id !== id));
        }
    };

    const updateCourse = (id: string, field: keyof Course, value: string) => {
        setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const copy = () => {
        if (!result) return;
        navigator.clipboard.writeText(`My GPA: ${result}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-10 items-stretch animate-in fade-in zoom-in duration-500">
            <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Semester Courses</h3>
                
                <div className="space-y-4 bg-muted/10 p-6 rounded-3xl border-2 border-border/50">
                    <div className="grid grid-cols-12 gap-4 px-2">
                        <div className="col-span-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Grade</div>
                        <div className="col-span-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Credits</div>
                        <div className="col-span-2"></div>
                    </div>

                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {courses.map((course) => (
                            <div key={course.id} className="grid grid-cols-12 gap-4 items-center animate-in slide-in-from-left duration-300">
                                <div className="col-span-6">
                                    <select 
                                        value={course.grade} 
                                        onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                                        className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-sm"
                                    >
                                        {Object.keys(gradePoints).map(g => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-4">
                                    <input 
                                        type="number" 
                                        value={course.credits} 
                                        onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                                        className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all font-bold text-sm text-center"
                                        placeholder="3"
                                    />
                                </div>
                                <div className="col-span-2 flex justify-end">
                                    <button 
                                        onClick={() => removeCourse(course.id)}
                                        className="p-3 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button 
                        onClick={addCourse}
                        className="w-full py-4 mt-2 flex items-center justify-center gap-2 bg-primary/10 text-primary rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary/20 transition-all border-2 border-dashed border-primary/30"
                    >
                        <Plus size={16} /> Add Course
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">GPA Result</h3>
                
                {result ? (
                    <div className="bg-muted/20 border-2 border-border rounded-3xl p-8 flex flex-col items-center justify-center gap-8 min-h-[400px]">
                        <div className="text-center space-y-4">
                            <div className="text-8xl font-black text-primary animate-in fade-in zoom-in duration-500">{result}</div>
                            <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Your Grade Point Average</div>
                            
                            <div className="mt-8 px-10 py-4 rounded-3xl bg-primary/10 border-2 border-primary/20 flex flex-col items-center gap-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Scale Breakdown</span>
                                <div className="flex gap-4 font-black text-xs uppercase text-primary">
                                    <span>4.0 Scale</span>
                                    <span className="text-muted-foreground/30">|</span>
                                    <span>US Standard</span>
                                </div>
                            </div>
                        </div>

                        <button onClick={copy} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
                            {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copied ? 'GPA Copied' : 'Copy Result'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-muted/10 border-2 border-dashed border-border rounded-3xl flex-1 flex flex-col items-center justify-center text-muted-foreground/30 gap-4 min-h-[400px]">
                        <span className="text-xs font-black uppercase tracking-widest text-center px-10">Add at least one course with credits to see your GPA</span>
                    </div>
                )}
            </div>
        </div>
    );
}
