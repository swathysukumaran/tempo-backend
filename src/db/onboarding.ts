import mongoose from 'mongoose';


const OnboardingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    currentStep: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['not_started', 'in_progress', 'completed'],
        default: 'not_started'
    },
    completedSteps: [{
        type: [Number],
        default:[]
    }],
    temporaryPreferences: {
        type: Object,
        default: {
            pace: '',
            activities: [],
            startTime: '',
            avoidances: []
        }
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export const OnboardingModel = mongoose.model('Onboarding', OnboardingSchema);

export const startOnboarding = async (userId: mongoose.Schema.Types.ObjectId) => {
    try {
        return await OnboardingModel.create({
            userId,
            status: 'in_progress'
        });
    } catch (error) {
        throw new Error(error.message);
    }
}

export const updateOnboarding = async (userId: mongoose.Schema.Types.ObjectId,status:string,completedSteps:number[],preferences:Object) => {
    try {
        return await OnboardingModel.findOneAndUpdate({userId:userId},{$addToSet: {completedSteps: { $each: completedSteps } },  
                status: status,
                temporaryPreferences: preferences,
                lastUpdated: new Date()},{new:true});
    } catch (error) {
        throw new Error(error);
    }
}

export const getOnboarding = async (userId: mongoose.Schema.Types.ObjectId) => {
    try {
        console.log("indb",userId);
        return await OnboardingModel.findOne({userId:userId});
    } catch (error) {
        throw new Error(error);
    }
}