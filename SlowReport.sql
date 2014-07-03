		SELECT		a.employee_id, a.client_roster_id, a.office_id, 
					(e.emp_id_prefix + f.office_cd + c.aident_number) as temp_number,
					ISNULL(b.employee_punch_id, -1) as employee_punch_id,
					b.department_id as punch_department_id,
					g.department_name as punch_department_name,
					b.punch_dt as punch_dt, b.rounded_punch_dt, c.first_name, c.last_name,
					ISNULL(csl2.shift_start_time, csl.shift_start_time) as shift_start_time, 
					ISNULL(csl2.shift_end_time, csl.shift_end_time) as shift_end_time,
					ISNULL(b.shift_type, d.shift_type) as moved_shift_type,
					b.last_updated_by, b.last_updated_dt,b.manual_override_flag, b.created_by, b.created_dt,
					d.shift_type, ISNULL(b.week_ending_date, '1900-01-01') as week_ending_date,
					b.approved_flag, ISNULL(b.approved_by, '') as approved_by,
					ISNULL(a.override_break_time, 0) as override_break_time,
					@minWage as minimum_wage, ISNULL(i.pay_rate, 0.00) as default_pay_rate,
					ISNULL(j.pay_rate, 0.00) as pay_rate, csl.shift_id,isnull(@defJobCode,0) as def_job_code,isnull(cj.job_code,0) as client_job_code, isnull(ej.job_code,0) as employee_job_code_override,
					ISNULL(eb.bonus, 0.00) as bonus,  ISNULL(cc.cost_center_id,0) as cost_center, @modify AS modify		
		FROM		client_roster a 
					INNER JOIN employee_punch b on a.client_roster_id = b.client_roster_id and
						b.punch_dt >= @startDateTime and b.punch_dt <= @endDateTime
					INNER JOIN employee c on a.employee_id=c.employee_id
					INNER JOIN client_shift_location csl on a.client_id=csl.client_id 
						and a.shift_id=csl.shift_id 
						and a.location_id=csl.location_id
					INNER JOIN shift d on a.shift_id=d.shift_id 
					INNER JOIN client e on a.client_id=e.client_id
					INNER JOIN office f on a.office_id=f.office_id
					INNER JOIN department g on b.department_id=g.department_id
					LEFT OUTER JOIN client_pay i on csl.client_id=i.client_id
						and csl.shift_id = i.shift_id
						and csl.location_id = i.location_id
						and @weekEndDate between i.effective_dt and i.expiration_dt
					LEFT OUTER JOIN client_pay_override j on a.client_id=j.client_id
						and a.shift_id = j.shift_id
						and a.location_id = j.location_id
						and a.employee_id=j.employee_id
						and @weekEndDate between j.effective_dt and j.expiration_dt
					LEFT OUTER JOIN client_jobcode cj on a.client_id=cj.client_id and d.shift_id=cj.shift_id and @weekEndDate between cj.effective_dt and cj.expiration_dt
					LEFT OUTER JOIN client_jobcode_override ej on c.employee_id=ej.employee_id and d.shift_id=ej.shift_id and @weekEndDate between ej.effective_dt and ej.expiration_dt
					LEFT OUTER JOIN employee_bonus eb ON eb.aident_number = c.aident_number AND eb.week_ending = @weekEndDate AND
						eb.client_id = @clientID AND eb.dept_id = b.department_id		
					LEFT OUTER JOIN jb_cost_center_department ccd ON ccd.department_id = b.department_id 
					LEFT OUTER JOIN jb_cost_center cc ON cc.cost_center_id = ccd.cost_center_id
					LEFT OUTER JOIN client_shift_location csl2 ON csl2.client_id = @clientID AND
						csl2.department_id = b.department_id AND csl2.shift_id IN 
						(SELECT shift_id FROM shift s WHERE s.shift_type = b.shift_type)
						
		WHERE		a.client_id=@clientID --and
					--a.client_roster_id = @clientRosterID
		ORDER BY	g.department_name, moved_shift_type, c.last_name, c.first_name, a.employee_id, b.rounded_punch_dt
