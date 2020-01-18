select concat(
'insert into standard_weights values (',
id::varchar(100), ',',
'false,',
'''', name, ''',',
'''', code, ''',',
'''', description, ''',',
is_active::varchar(10), ',',
created_by::varchar(10), ',',
updated_by::varchar(10), ',',
'current_timestamp,',
'current_timestamp',
')'
) as sqlScript from standard_weights order by id
------------------------------------------------------------------------------
select
concat(
'{##',
'id: ', id::varchar(100),',##',
'is_editing: ','false',',##',
'name: ''', name,''',##',
'code: ''', code,''',##',
'description: ''', description,''',##',
'is_active: ','true',',##',
'created_by: ','1',',##',
'updated_by: ','1','##',
'},##') as json
from standard_weights order by id
-------------------------------------------------------------------------------
select
concat(
'{##',
'id: ', id::varchar(100),',##',
'is_editing: ','false',',##',
'name: ''', name,''',##',
'code: ''', code,''',##',
'description: ''', description,''',##',
'parent_item_id: ', COALESCE(parent_item_id::varchar(150), 'null'),',##',
'material_type_id: ', material_type_id::varchar(150),',##',
'category_id: ', category_id::varchar(100),',##',
'item_group_id: ', item_group_id::varchar(100),',##',
'is_active: ','true',',##',
'created_by: ','1',',##',
'updated_by: ','1','##',
'},##') as json
from items order by id
-------------------------------------------------------------------------------
select
concat(
'{##',
'is_editing: ','false',',##',
'transaction_id: ','1',',##',
'item_id: ',item_id::varchar(100),',##',
'material_quality_id: ',material_quality_id::varchar(100),',##',
'tag_id: ',tag_id::varchar(100),',##',
'standard_weight_id: ',standard_weight_id::varchar(100),',##',
'quantity: ',quantity::varchar(100),',##',
'weight: ',weight::varchar(100),',##',
'gem_weight: ',gem_weight::varchar(100),',##',
'is_active: ','true',',##',
'created_by: ','1',',##',
'updated_by: ','1','##',
'}##') as json
from transaction_details
------------------------------------------------------------------------
select
concat(
'{##',
'id: ', id::varchar(100) ,',##',
'is_editing: ','false',',##',
'name: ''', name,''',##',
'code: ''', code,''',##',
'description: ''', description,''',##',
'account_type_id: ', account_type_id::varchar(100),',##',
'parent_account_id: ', COALESCE(parent_account_id::varchar(100), 'null'),',##',
'category_id: ', COALESCE(category_id::varchar(100), 'null'),',##',
'department_id: ', COALESCE(department_id::varchar(100), 'null'),',##',
'is_group: ', is_group::varchar(100),',##',
'is_active: ','true',',##',
'created_by: ','1',',##',
'updated_by: ','1','##',
'},##') as json
from accounts order by is_group desc, parent_account_id, department_id, id
-------------------------------------------------------------------------------------
select
concat(
'{##',
'id: ', id::varchar(100),',##',
'is_editing: ','false',',##',
'name: ''', name,''',##',
'code: ''', code,''',##',
'description: ''', description,''',##',
'parent_category_id: ', COALESCE(parent_category_id::varchar(100), 'null'),',##',
'is_group: ', is_group::varchar(100),',##',
'is_active: ','true',',##',
'created_by: ','1',',##',
'updated_by: ','1','##',
'},##') as json
from categories order by id
---------------------------------------------------------------------------------------
select
concat(
'{##',
'id: ', id::varchar(100),',##',
'is_editing: ','false',',##',
'name: ''', name,''',##',
'code: ''', code,''',##',
'description: ''', description,''',##',
'group_type_id: ', COALESCE(group_type_id::varchar(100), 'null'),',##',
'category_id: ', COALESCE(category_id::varchar(100), 'null'),',##',
'owner_id: ', COALESCE(owner_id::varchar(100), 'null'),',##',
'is_active: ','true',',##',
'created_by: ','1',',##',
'updated_by: ','1','##',
'},##') as json
from groups order by id
