import { useState } from "react";
import { 
  Box, Button, Table, ActionIcon, Group, Badge, Text, 
  Modal, TextInput, Stack, Switch, Paper, Title, Grid, NavLink, ScrollArea, TagsInput
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconTrash, IconPlus, IconTags, IconFolder } from "@tabler/icons-react";
import { useCustomProductTypes } from "@/hooks/admin/useCustomProductTypes";
import { useCustomProductCategories } from "@/hooks/admin/useCustomProductCategories";
import { useCurrentAdminUser } from "@/hooks/admin/useCurrentAdminUser";
import { ICustomProductType, ICustomProductCategory } from "@/types/sales-expenses";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { toast } from "react-toastify";

export default function ProductManager() {
  const { data: productTypes, isLoading: loadingTypes, createProductType, createBulkProductTypes, updateProductType, deleteProductType } = useCustomProductTypes();
  const { data: categories, isLoading: loadingCategories, createCategory, updateCategory, deleteCategory } = useCustomProductCategories();
  
  const { adminUser } = useCurrentAdminUser();
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  // Modals state
  const [openedType, { open: openType, close: closeType }] = useDisclosure(false);
  const [openedCat, { open: openCat, close: closeCat }] = useDisclosure(false);
  const [deleteCatModalOpened, setDeleteCatModalOpened] = useState(false);
  const [catToDelete, setCatToDelete] = useState<string | null>(null);
  const [deleteTypeModalOpened, setDeleteTypeModalOpened] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<string | null>(null);
  const [isDeletingCat, setIsDeletingCat] = useState(false);
  const [isDeletingType, setIsDeletingType] = useState(false);

  const [editingType, setEditingType] = useState<ICustomProductType | null>(null);
  const [editingCat, setEditingCat] = useState<ICustomProductCategory | null>(null);

  const [typeForm, setTypeForm] = useState({ names: [] as string[], name: "", is_active: true, category_id: "" });
  const [catForm, setCatForm] = useState({ name: "", description: "", is_active: true });

  const activeCategoryTypes = productTypes?.filter(t => t.category_id === activeCategoryId || (!t.category_id && activeCategoryId === 'uncategorized')) || [];

  // CATEGORY HANDLERS
  const handleOpenCatModal = (cat?: ICustomProductCategory) => {
    if (cat) {
      setEditingCat(cat);
      setCatForm({ name: cat.name, description: cat.description || "", is_active: cat.is_active });
    } else {
      setEditingCat(null);
      setCatForm({ name: "", description: "", is_active: true });
    }
    openCat();
  };

  const handleCatSubmit = async () => {
    if (!catForm.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      const audit = {
        userId: adminUser?.id || "",
        name: adminUser?.firstName + " " + adminUser?.lastName,
        email: adminUser?.email || "",
        role: adminUser?.role || "",
        image: adminUser?.avatar || "",
      };

      if (editingCat) {
        await updateCategory({ id: editingCat.id, ...catForm, updatedBy: audit });
      } else {
        await createCategory({ ...catForm, createdBy: audit });
      }
      closeCat();
    } catch (err) {}
  };

  const handleDeleteCatClick = (id: string) => {
    setCatToDelete(id);
    setDeleteCatModalOpened(true);
  };

  const confirmDeleteCat = async () => {
    if (!catToDelete) return;
    setIsDeletingCat(true);
    try {
      const audit = {
        userId: adminUser?.id || "",
        name: adminUser?.firstName + " " + adminUser?.lastName,
        email: adminUser?.email || "",
        role: adminUser?.role || "",
        image: adminUser?.avatar || "",
      };
      await deleteCategory({ id: catToDelete, deletedBy: audit });
      if (activeCategoryId === catToDelete) setActiveCategoryId(null);
    } finally {
      setIsDeletingCat(false);
      setDeleteCatModalOpened(false);
      setCatToDelete(null);
    }
  };

  // TYPE HANDLERS
  const handleOpenTypeModal = (type?: ICustomProductType) => {
    if (type) {
      setEditingType(type);
      setTypeForm({ names: [type.name], name: type.name, is_active: type.is_active, category_id: type.category_id || "" });
    } else {
      setEditingType(null);
      setTypeForm({ names: [], name: "", is_active: true, category_id: activeCategoryId && activeCategoryId !== 'uncategorized' ? activeCategoryId : "" });
    }
    openType();
  };

  const handleTypeSubmit = async () => {
    if (editingType) {
      if (!typeForm.name.trim()) {
        toast.error("Name is required");
        return;
      }
    } else {
      if (typeForm.names.length === 0) {
        toast.error("At least one product type name is required");
        return;
      }
    }

    try {
      const audit = {
        userId: adminUser?.id || "",
        name: adminUser?.firstName + " " + adminUser?.lastName,
        email: adminUser?.email || "",
        role: adminUser?.role || "",
        image: adminUser?.avatar || "",
      };

      if (editingType) {
        await updateProductType({ id: editingType.id, name: typeForm.name, is_active: typeForm.is_active, category_id: typeForm.category_id, updatedBy: audit });
      } else {
        const bulkTypes = typeForm.names.map(n => ({
          name: n,
          is_active: typeForm.is_active,
          category_id: typeForm.category_id || undefined,
          createdBy: audit
        }));
        await createBulkProductTypes(bulkTypes);
      }
      closeType();
    } catch (err) {}
  };

  const handleDeleteTypeClick = (id: string) => {
    setTypeToDelete(id);
    setDeleteTypeModalOpened(true);
  };

  const confirmDeleteType = async () => {
    if (!typeToDelete) return;
    setIsDeletingType(true);
    try {
      const audit = {
        userId: adminUser?.id || "",
        name: adminUser?.firstName + " " + adminUser?.lastName,
        email: adminUser?.email || "",
        role: adminUser?.role || "",
        image: adminUser?.avatar || "",
      };
      await deleteProductType({ id: typeToDelete, deletedBy: audit });
    } finally {
      setIsDeletingType(false);
      setDeleteTypeModalOpened(false);
      setTypeToDelete(null);
    }
  };

  return (
    <Box>
      <Group justify="space-between" mb="md">
        <div>
          <Title order={3}>Product Categories & Types</Title>
          <Text c="dimmed" size="sm">Manage categories and their respective product types for Sales & Expenses.</Text>
        </div>
        <Group>
          <Button variant="default" leftSection={<IconFolder size="1rem" />} onClick={() => handleOpenCatModal()}>
            New Category
          </Button>
          <Button color="pink" leftSection={<IconPlus size="1rem" />} onClick={() => handleOpenTypeModal()}>
            New Product Type
          </Button>
        </Group>
      </Group>

      <Grid gutter="md">
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Paper withBorder p="0" style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
            <Box p="sm" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
              <Text fw={600} size="sm" tt="uppercase" c="dimmed">Categories</Text>
            </Box>
            <ScrollArea flex={1} p="sm">
              <NavLink
                label="All Types"
                active={activeCategoryId === null}
                onClick={() => setActiveCategoryId(null)}
                leftSection={<IconTags size="1rem" />}
                variant="filled"
                color="pink"
                mb="xs"
                style={{ borderRadius: '4px' }}
              />
              <NavLink
                label="Uncategorized"
                active={activeCategoryId === 'uncategorized'}
                onClick={() => setActiveCategoryId('uncategorized')}
                leftSection={<IconFolder size="1rem" />}
                variant="filled"
                color="pink"
                mb="xs"
                style={{ borderRadius: '4px' }}
              />
              
              {categories?.map((cat) => (
                <Box key={cat.id} style={{ display: 'flex', alignItems: 'center' }}>
                  <NavLink
                    label={cat.name}
                    active={activeCategoryId === cat.id}
                    onClick={() => setActiveCategoryId(cat.id)}
                    leftSection={<IconFolder size="1rem" />}
                    variant="filled"
                    color="pink"
                    mb="xs"
                    style={{ borderRadius: '4px', flex: 1 }}
                    description={cat.description || (cat.is_active ? 'Active' : 'Inactive')}
                  />
                  {activeCategoryId === cat.id && (
                    <Group gap="0" ml="xs">
                      <ActionIcon variant="subtle" color="blue" size="sm" onClick={(e) => { e.stopPropagation(); handleOpenCatModal(cat); }}>
                        <IconEdit size="1rem" />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="red" size="sm" onClick={(e) => { e.stopPropagation(); handleDeleteCatClick(cat.id); }}>
                        <IconTrash size="1rem" />
                      </ActionIcon>
                    </Group>
                  )}
                </Box>
              ))}
            </ScrollArea>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 9 }}>
          <Paper withBorder p="md" style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
            <ScrollArea flex={1}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    {activeCategoryId === null && <Table.Th>Category</Table.Th>}
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {loadingTypes ? (
                    <Table.Tr>
                      <Table.Td colSpan={4} align="center">Loading...</Table.Td>
                    </Table.Tr>
                  ) : (activeCategoryId === null ? productTypes : activeCategoryTypes)?.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={4} align="center">No product types found.</Table.Td>
                    </Table.Tr>
                  ) : (
                    (activeCategoryId === null ? productTypes : activeCategoryTypes)?.map((type) => (
                      <Table.Tr key={type.id}>
                        <Table.Td fw={500}>{type.name}</Table.Td>
                        {activeCategoryId === null && (
                          <Table.Td>
                            {categories?.find(c => c.id === type.category_id)?.name || "Uncategorized"}
                          </Table.Td>
                        )}
                        <Table.Td>
                          <Badge color={type.is_active ? "green" : "gray"}>
                            {type.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <ActionIcon variant="subtle" color="blue" onClick={() => handleOpenTypeModal(type)}>
                              <IconEdit size="1.2rem" />
                            </ActionIcon>
                            <ActionIcon variant="subtle" color="red" onClick={() => handleDeleteTypeClick(type.id)}>
                              <IconTrash size="1.2rem" />
                            </ActionIcon>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  )}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* CATEGORY MODAL */}
      <Modal opened={openedCat} onClose={closeCat} title={editingCat ? "Edit Category" : "Add Category"}>
        <Stack gap="md">
          <TextInput
            label="Category Name"
            required
            value={catForm.name}
            onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
            placeholder="e.g., Large Format Printing"
          />
          <TextInput
            label="Description"
            value={catForm.description}
            onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
            placeholder="Optional description"
          />
          <Switch
            label="Active"
            checked={catForm.is_active}
            onChange={(e) => setCatForm({ ...catForm, is_active: e.currentTarget.checked })}
            color="pink"
          />
          <Group justify="flex-end" mt="md">
            <Button variant="light" color="gray" onClick={closeCat}>Cancel</Button>
            <Button color="pink" onClick={handleCatSubmit}>Save</Button>
          </Group>
        </Stack>
      </Modal>

      {/* TYPE MODAL */}
      <Modal opened={openedType} onClose={closeType} title={editingType ? "Edit Product Type" : "Add Product Types"}>
        <Stack gap="md">
          {editingType ? (
            <TextInput
              label="Product Type Name"
              required
              value={typeForm.name}
              onChange={(e) => setTypeForm({ ...typeForm, name: e.target.value })}
              placeholder="e.g., Roll-up Banner"
            />
          ) : (
            <TagsInput
              label="Product Type Names"
              description="Type a name and press Enter to add multiple types at once"
              required
              value={typeForm.names}
              onChange={(val) => setTypeForm({ ...typeForm, names: val })}
              placeholder="e.g., Roll-up Banner, A4 Flyers..."
              clearable
            />
          )}
          
          <Box>
            <Text size="sm" fw={500} mb={3}>Category</Text>
            <select
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
              value={typeForm.category_id}
              onChange={(e) => setTypeForm({ ...typeForm, category_id: e.target.value })}
            >
              <option value="">Uncategorized</option>
              {categories?.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Box>

          <Switch
            label="Active"
            checked={typeForm.is_active}
            onChange={(e) => setTypeForm({ ...typeForm, is_active: e.currentTarget.checked })}
            color="pink"
          />
          <Group justify="flex-end" mt="md">
            <Button variant="light" color="gray" onClick={closeType}>Cancel</Button>
            <Button color="pink" onClick={handleTypeSubmit}>Save</Button>
          </Group>
        </Stack>
      </Modal>

      <ConfirmationModal
        opened={deleteCatModalOpened}
        onClose={() => setDeleteCatModalOpened(false)}
        onConfirm={confirmDeleteCat}
        title="Delete Category"
        loading={isDeletingCat}
        confirmLabel="Delete"
        confirmColor="red"
      >
        Are you sure you want to delete this category? Product types in this category will not be deleted but may be left uncategorized.
      </ConfirmationModal>

      <ConfirmationModal
        opened={deleteTypeModalOpened}
        onClose={() => setDeleteTypeModalOpened(false)}
        onConfirm={confirmDeleteType}
        title="Delete Product Type"
        loading={isDeletingType}
        confirmLabel="Delete"
        confirmColor="red"
      >
        Are you sure you want to delete this product type? This action can be reversed by an administrator.
      </ConfirmationModal>
    </Box>
  );
}