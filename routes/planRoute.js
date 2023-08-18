const express = require("express");
const router = express.Router();
const Plan = require("../models/planModel");
const authenticateToken = require("../middleware/auth");


router.post("/", authenticateToken, async (req, res) => {
    try {
        const planData = {
            user_id: req.user._id,
            cycle_type: req.body.cycle_type,
            cycle_from: req.body.cycle_from,
            cycle_to: req.body.cycle_to,
            eligibility_type: req.body.eligibility_type,
            eligibility_date: req.body.eligibility_date,
            eligibility_percentage: req.body.eligibility_percentage,
            salary_component: req.body.salary_component,
            salary_component_list: req.body.salary_component_list,
            global_currency: req.body.global_currency,
            global_currency_list: req.body.global_currency_list,
            prorate: req.body.prorate,
            prorate_unit: req.body.prorate_unit,
            off_cycle_prorate: req.body.off_cycle_prorate,
            off_cycle_prorate_unit: req.body.off_cycle_prorate_unit,
            parity: req.body.parity,
            merit_guidline: req.body.merit_guidline,
            supervisor_validation: req.body.supervisor_validation,
            split_recommendation: req.body.split_recommendation,
            calculation_split_recommendation: req.body.calculation_split_recommendation,
            matrix_recommendation: req.body.matrix_recommendation,
            calculation_matrix_recommendation: req.body.calculation_matrix_recommendation,
            paygroups: req.body.paygroups,
            paygroups_name: req.body.paygroups_name,
            enable_recommendation: req.body.enable_recommendation,
            pay_range_min: req.body.pay_range_min,
            pay_range_max: req.body.pay_range_max,
            enable_bonus_incentives: req.body.enable_bonus_incentives,
            use_diff_bonus_incentives: req.body.use_diff_bonus_incentives,
            basis_of_bonus: req.body.basis_of_bonus,
            bonus_list: req.body.bonus_list,
            merit_group_list: req.body.merit_group_list,
            bonus_group_list: req.body.bonus_group_list,
            budget_value: req.body.budget_value,
            budget_unit: req.body.budget_unit,
            hold_back: req.body.hold_back,
            hold_back_value: req.body.hold_back_value,
            hold_back_unit: req.body.hold_back_unit,
            statutory_increment: req.body.statutory_increment,
            employee_group: req.body.employee_group,
            increment_value: req.body.increment_value,
            increment_unit: req.body.increment_unit
        };

        const plan = new Plan(planData);

        const result = await plan.save();

        res.status(201).json({
            message: "Plan created successfully!",
            result: result,
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            error: "An error occurred while creating the plan.",
        });
    }
});


router.post("/time-based-bonus", authenticateToken, async (req, res) => {
    try {
        const userId = req.user._id;
        
        let updatedPlan = await Plan.findOneAndUpdate(
            { user_id: userId },
            {
                time_based_bonus: {
                    name: req.body.name,
                    eligibility_data: req.body.eligibility_data,
                    bonus_based_on: req.body.bonus_based_on,
                    bonus_percentage: req.body.bonus_percentage,
                    manager_recommendation: req.body.manager_recommendation,
                    manager_recommendation_percentage: req.body.manager_recommendation_percentage,
                    bonus_guideline_percentage: req.body.bonus_guideline_percentage,
                    pro_rate_bonus: req.body.pro_rate_bonus,
                    pro_rate_bonus_unit: req.body.pro_rate_bonus_unit,
                }
            },
            { new: true, upsert: true, useFindAndModify: false }
        );
      
        res.json(updatedPlan); // Send the updated Plan object as the response
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            error: "An error occurred while creating the plan.",
        });
    }
});

router.post("/performance-bonus", authenticateToken, async (req, res) => {
    try {
        const userId = req.user._id; // Assuming you have a way to get the userId
        const performanceBonusData = {
            name: req.body.name,
            eligibility_data: req.body.eligibility_data,
            bonus_based_on_salary: req.body.bonus_based_on_salary || false,
            bonus_percentage: req.body.bonus_percentage,
            performance_rating: req.body.performance_rating || false,
            name_of_bonus_factor: req.body.name_of_bonus_factor,
            bonus_table: req.body.bonus_table,
            bonus_multiplier: req.body.bonus_multiplier || false,
            org_bonus_multiplier: req.body.org_bonus_multiplier,
            team_score: req.body.team_score,
            manager_recommendation: req.body.manager_recommendation || false,
            manager_recommendation_percentage: req.body.manager_recommendation_percentage,
            bonus_guideline_percentage: req.body.bonus_guideline_percentage,
            pro_rate_bonus: req.body.pro_rate_bonus || false,
            pro_rate_bonus_unit: req.body.pro_rate_bonus_unit,
        };

        const updatedPlan = await Plan.findOneAndUpdate(
            { user_id: userId },
            { $set: { performance_bonus: performanceBonusData } },
            { new: true, upsert: true, useFindAndModify: false }
        );

        res.json(updatedPlan);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            error: "An error occurred while updating the performance bonus.",
        });
    }
});

module.exports = router;