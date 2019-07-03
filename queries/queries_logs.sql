# consumption of value
select t1.customer_id, sum(t1.value), date(t1.timestamp_begin)
from "BOXX_15min20k" t1
inner join
(select customer_id from "BOXX_15min20k"
where variable = 'solar_prod'
group by customer_id) t2
on t1.customer_id = t2.customer_id
where t1.variable = 'elec_cons_lt' or t1.variable = 'elec_cons_ht'
group by t1.customer_id, date(t1.timestamp_begin)
order by t1.customer_id

# average elec-cons of users with solar panels per day
select sum(t1.value)/count(t1.customer_id), date(t1.timestamp_begin)
from "BOXX_15min20k" t1
inner join
(select customer_id from "BOXX_15min20k"
where variable = 'solar_prod'
group by customer_id) t2
on t1.customer_id = t2.customer_id
where t1.variable = 'elec_cons_lt' or t1.variable = 'elec_cons_ht'
group by date(t1.timestamp_begin)
