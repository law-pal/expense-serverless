import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Form,
  Label,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createExpense, deleteExpense, getExpenses, patchExpense } from '../api/expenses-api'
import Auth from '../auth/Auth'
import { Expense } from '../types/Expense'

interface ExpensesProps {
  auth: Auth
  history: History
}

interface ExpensesState {
  expenses: Expense[]
  newExpenseName: string
  newAmount: string
  loadingExpenses: boolean
}

export class Expenses extends React.PureComponent<ExpensesProps, ExpensesState> {
  state: ExpensesState = {
    expenses: [],
    newExpenseName: '',
    newAmount: '',
    loadingExpenses: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newExpenseName: event.target.value })
  }

  handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newAmount: event.target.value })
  }

  onEditButtonClick = (expenseId: string) => {
    this.props.history.push(`/expenses/${expenseId}/edit`)
  }

  onExpenseCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const date = this.calculateDueDate()
      const amount = parseFloat(this.newAmount())
      const newExpense = await createExpense(this.props.auth.getIdToken(), {
        name: this.state.newExpenseName,
        date,
        amount
      })
      this.setState({
        expenses: [...this.state.expenses, newExpense],
        newExpenseName: '',
        newAmount: ''
      })
    } catch {
      alert('Expense creation failed')
    }
  }

  onExpenseDelete = async (expenseId: string) => {
    try {
      await deleteExpense(this.props.auth.getIdToken(), expenseId)
      this.setState({
        expenses: this.state.expenses.filter(expense => expense.expenseId != expenseId)
      })
    } catch {
      alert('Expense deletion failed')
    }
  }

  onExpenseCheck = async (pos: number) => {
    try {
      const expense = this.state.expenses[pos]
      await patchExpense(this.props.auth.getIdToken(), expense.expenseId, {
        name: expense.name,
        date: expense.date,
        amount: expense.amount
      })
      this.setState({
        expenses: update(this.state.expenses, {
          [pos]: { date: { $set: expense.date } }
        })
      })
    } catch {
      alert('expense deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const expenses = await getExpenses(this.props.auth.getIdToken())
      this.setState({
        expenses,
        loadingExpenses: false
      })
    } catch (e) {
      alert(`Failed to fetch expenses: ${e.message}`)
    }
  }

  handleSubmit(e: any){
    e.preventDefault();
    e.target.reset();
}

  render() {
    
    return (
      <div>
        <Header as="h1">Expenses</Header>

        {this.renderCreateExpenseInput()}

        {this.renderExpenses()}
      </div>
    )
  }

  renderCreateExpenseInput() {
    
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Form  onSubmit={this.handleSubmit} >
            <Form.Field>
              <Input
                action={{
                  color: 'facebook',
                  labelPosition: 'left',
                  icon: 'none',
                  content: 'New expense',
                }}
                fluid
                actionPosition="left"
                placeholder="Enter a new expense..."
                
                onChange={this.handleNameChange}
              />
              </Form.Field>
              <Form.Field>
              <Input
                action={{
                  color: 'facebook',
                  labelPosition: 'left',
                  icon: 'none',
                  content: 'New amount',
                }}
                fluid
                actionPosition="left"
                placeholder="Enter amount..."
                onChange={this.handleAmountChange}
              />
          </Form.Field>
          <Form.Field control={Button} onClick={this.onExpenseCreate}type='submit'>Submit</Form.Field>
          </Form>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderExpenses() {
    if (this.state.loadingExpenses) {
      return this.renderLoading()
    }

    return this.renderExpensesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Expenses
        </Loader>
      </Grid.Row>
    )
  }

  renderExpensesList() {
    return (
      <Grid padded>
        {this.state.expenses.map((expense) => {
          return (
            <Grid.Row key={expense.expenseId}>
              <Grid.Column width={4} verticalAlign="middle">
              {expense.attachmentUrl && (
                <Image src={expense.attachmentUrl} size="large" wrapped />
              )}
              </Grid.Column>
              <Grid.Column width={9} floated="left">
                <Header size='large'>Name:{'  '}{expense.name}</Header>
                <Header size='large'>Amount:{'  '}${expense.amount}</Header>
                <Header size='large'> Date:{'  '}{expense.date}</Header>
              <Divider/>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="facebook"
                  onClick={() => this.onEditButtonClick(expense.expenseId)}
                >
                <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="youtube"
                  onClick={() => this.onExpenseDelete(expense.expenseId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
      
    )
  }

  // returns a new amount 
  newAmount(): string {
    return this.state.newAmount
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
