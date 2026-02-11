export namespace clock {
	
	export class Session {
	    ID: number;
	    // Go type: time
	    Start: any;
	    // Go type: time
	    End: any;
	    Description: string;
	
	    static createFrom(source: any = {}) {
	        return new Session(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Start = this.convertValues(source["Start"], null);
	        this.End = this.convertValues(source["End"], null);
	        this.Description = source["Description"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

export namespace settings {
	
	export class Settings {
	    WorkSession: number;
	    LongRestSession: number;
	    ShortRestSession: number;
	    Cycle: string[];
	
	    static createFrom(source: any = {}) {
	        return new Settings(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.WorkSession = source["WorkSession"];
	        this.LongRestSession = source["LongRestSession"];
	        this.ShortRestSession = source["ShortRestSession"];
	        this.Cycle = source["Cycle"];
	    }
	}

}

export namespace tasks {
	
	export class Task {
	    ID: number;
	    Title: string;
	    Completed: boolean;
	    WorkSessions: number;
	    ShortRestSessions: number;
	    LongRestSessions: number;
	    Cycles: number;
	
	    static createFrom(source: any = {}) {
	        return new Task(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Title = source["Title"];
	        this.Completed = source["Completed"];
	        this.WorkSessions = source["WorkSessions"];
	        this.ShortRestSessions = source["ShortRestSessions"];
	        this.LongRestSessions = source["LongRestSessions"];
	        this.Cycles = source["Cycles"];
	    }
	}

}

